/**
 * Robô Entregador Autônomo - Firmware ESP8266
 * ExpoTech 2025 - UNIFECAF
 * 
 * Recebe comandos de rotas via Interface Web (HTTP)
 * Executa movimentos baseados nas 7 rotas do grafo
 * 
 * Hardware:
 * - NodeMCU ESP8266
 * - 2x Motores DC
 * - Sistema FS para interface web
 */

#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>

// ========== CONFIGURAÇÃO WIFI ==========
const char* homeSSID = "Residencia_dos_Moreira";        // Rede doméstica
const char* homePassword = "EMAR852020";   // Senha da rede
const char* apSSID = "RoboEntregador";          // Nome do ponto de acesso
const char* apPassword = "85852020";            // Senha do ponto de acesso

// ========== PINOS DOS MOTORES DC ==========
const int pinMotor1F = 5;   // D1 - Motor 1 Frente
const int pinMotor1T = 4;   // D2 - Motor 1 Trás
const int pinMotor2F = 0;   // D3 - Motor 2 Frente
const int pinMotor2T = 2;   // D4 - Motor 2 Trás

// ========== SERVIDOR WEB ==========
AsyncWebServer server(80);

// ========== SISTEMA DE EXECUÇÃO ==========
bool executando = false;
int comandoAtual = -1;
unsigned long fimComando = 0;
const int pwmEsquerdo = 1023;  // Velocidade do motor em pwm

// ========== VARIÁVEIS PARA EXECUÇÃO COM PAUSAS ==========
bool trajetoRodando = false;
int trajetoIndex = 0;
bool pausandoEntrePassos = false;
unsigned long fimDaPausa = 0;

// ========== ESTRUTURA DE COMANDO ==========
struct Comando {
  int direcao;      // 0=Frente, 1=Ré, 2=Direita, 3=Esquerda, 4=Parar
  int duracao;      // Duração em milissegundos
};

// ========== ÍNDICE DE COMANDOS ==========
int totalComandos = 0;
Comando* comandosRota = nullptr;

// ========== DEFINIÇÃO DAS ROTAS ==========
// Baseado nas distâncias reais do grafo (velocidade ~10cm/s)

// ROTA 1: A → B → E → G (157.5cm = 15.8s)
Comando rota1[] = {
  {3, 125},
  {0, 650},
  {2, 100},
  {0, 935},
  {2, 95},
  {0, 550}
};

// ROTA 2: A → B → D → E → G (198cm = 19.8s)
Comando rota2[] = {
  {2, 125},
  {0, 910},
  {3, 145},
  {0, 900},
  {3, 115},
  {0, 800}
};

// ROTA 3: A → C → F → G (181cm = 18.1s)
Comando rota3[] = {
  {3, 125},
  {0, 725},
  {2, 80},
  {0, 150},
  {2, 130},
  {0, 590},
  {3, 220},
  {0, 800},
  {2, 200},
  {0, 500}
};

// ROTA 4: A → C → D → E → G (216cm = 21.6s)
Comando rota4[] = {
  {2, 150},
  {0, 1100},
  {3, 280},
  {0, 2300},
  {2, 270},
  {0, 720}
};

// ROTA 5: A → B → D → C → F → G (287cm = 28.7s)
Comando rota5[] = {
  {0, 4900},   // Frente 4.9s (49cm - A→B)
  {3, 600},    // Esquerda 0.6s (curva)
  {0, 6000},   // Frente 6s (60cm - B→D)
  {3, 700},    // Esquerda 0.7s (curva acentuada)
  {0, 6200},   // Frente 6.2s (62cm - D→C)
  {2, 600},    // Direita 0.6s (curva)
  {0, 6100},   // Frente 6.1s (61cm - C→F)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 5500}    // Frente 5.5s (55cm - F→G)
};

// ROTA 6: A → C → D → B → E → G (295.5cm = 29.6s)
Comando rota6[] = {
  {0, 6500},   // Frente 6.5s (65cm - A→C)
  {3, 600},    // Esquerda 0.6s (curva)
  {0, 6200},   // Frente 6.2s (62cm - C→D)
  {3, 700},    // Esquerda 0.7s (curva acentuada)
  {0, 6000},   // Frente 6s (60cm - D→B)
  {2, 600},    // Direita 0.6s (curva)
  {0, 6450},   // Frente 6.45s (64.5cm - B→E)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 4400}    // Frente 4.4s (44cm - E→G)
};

// ROTA 7: A → B → E → D → C → F → G (336.5cm = 33.7s)
Comando rota7[] = {
  {0, 4900},   // Frente 4.9s (49cm - A→B)
  {2, 500},    // Direita 0.5s (curva)
  {0, 6450},   // Frente 6.45s (64.5cm - B→E)
  {2, 700},    // Direita 0.7s (curva acentuada)
  {0, 4500},   // Frente 4.5s (45cm - E→D)
  {3, 700},    // Esquerda 0.7s (curva acentuada)
  {0, 6200},   // Frente 6.2s (62cm - D→C)
  {2, 600},    // Direita 0.6s (curva)
  {0, 6100},   // Frente 6.1s (61cm - C→F)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 5500}    // Frente 5.5s (55cm - F→G)
};

// ========== FUNÇÕES DE CONTROLE DOS MOTORES ==========

void controlMotor(int direcao) {
  switch (direcao) {
    case 0: // Frente
      Serial.println(">>> FRENTE");
      digitalWrite(pinMotor1F, pwmEsquerdo);
      digitalWrite(pinMotor1T, HIGH);
      digitalWrite(pinMotor2F, LOW);
      digitalWrite(pinMotor2T, HIGH);
      break;
      
    case 1: // Ré
      Serial.println(">>> RE");
      digitalWrite(pinMotor1F, HIGH);
      digitalWrite(pinMotor1T, LOW);
      digitalWrite(pinMotor2F, pwmEsquerdo);
      digitalWrite(pinMotor2T, HIGH);
      break;
      
    case 2: // Direita
      Serial.println(">>> DIREITA ");
      digitalWrite(pinMotor1F, pwmEsquerdo);
      digitalWrite(pinMotor1T, HIGH);
      digitalWrite(pinMotor2F, HIGH);
      digitalWrite(pinMotor2T, HIGH);
      break;
      
    case 3: // Esquerda
      Serial.println(">>> ESQUERDA");
      digitalWrite(pinMotor1F, pwmEsquerdo);
      digitalWrite(pinMotor1T, HIGH);
      digitalWrite(pinMotor2F, LOW);
      digitalWrite(pinMotor2T, LOW);
      break;

    case 4: // Parar
      Serial.println(">>> PARAR");
      digitalWrite(pinMotor1F, LOW);
      digitalWrite(pinMotor1T, LOW);
      digitalWrite(pinMotor2F, LOW);
      digitalWrite(pinMotor2T, LOW);
      break;
      
    default:
      Serial.println(">>> COMANDO INVALIDO");
      break;
  }
}

// Função para compatibilidade com as rotas
void controlar_motores(int direcao) {
  // Mapeia os comandos das rotas para o sistema do seu colega
  switch (direcao) {
    case 0: // Frente
      controlMotor(0);
      break;
    case 1: // Ré
      controlMotor(1);
      break;
    case 2: // Direita
      controlMotor(2);
      break;
    case 3: // Esquerda
      controlMotor(3);
      break;
    case 4: // Parar
      controlMotor(4);
      break;
  }
}

// ========== FUNÇÕES DE EXECUÇÃO DE ROTAS COM PAUSAS ==========

void executarComando(int direcao, int duracao) {
  if (executando) {
    Serial.println("AVISO: Ja esta executando um comando");
    return;
  }

  Serial.print("EXECUTANDO: ");
  Serial.print(direcao);
  Serial.print(" por ");
  Serial.print(duracao);
  Serial.println(" ms");

  controlar_motores(direcao);

  executando = true;
  fimComando = millis() + duracao;
}

void pararTrajeto() {
  trajetoRodando = false;
  trajetoIndex = 0;
  executando = false;
  pausandoEntrePassos = false;
  controlar_motores(4);
  Serial.println(">>> TRAJETO INTERROMPIDO");
}

void iniciarRota(Comando* rota, int tamanho, String nomeRota) {
  if (trajetoRodando) {
    Serial.println("AVISO: Ja esta executando uma rota");
    return;
  }
  
  comandosRota = rota;
  totalComandos = tamanho;
  trajetoIndex = 0;
  trajetoRodando = true;
  
  Serial.print(">>> INICIANDO ");
  Serial.print(nomeRota);
  Serial.print(" com ");
  Serial.print(totalComandos);
  Serial.println(" comandos");
  
  // Executa primeiro comando
  executarComando(comandosRota[0].direcao, comandosRota[0].duracao);
}

void executarProximoComando() {
  if (!trajetoRodando) return;
  
  trajetoIndex++;
  
  if (trajetoIndex < totalComandos) {
    executarComando(comandosRota[trajetoIndex].direcao, comandosRota[trajetoIndex].duracao);
  } else {
    // Rota finalizada
    Serial.println(">>> TRAJETO CONCLUÍDO");
    controlar_motores(4);
    trajetoRodando = false;
    trajetoIndex = 0;
    comandosRota = nullptr;
  }
}

// ========== CONFIGURAÇÃO DAS ROTAS WEB ==========

void configurarRotasWeb() {
  // Redireciona a raiz ("/") para "/index1.html"
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->redirect("/index1.html");
  });
  
  // Páginas HTML e CSS
  server.on("/index1.html", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(SPIFFS, "/index1.html", "text/html");
  });
  
// ========== ROTAS PARA EXECUÇÃO ==========

// Endpoint para executar rotas (compatível com backend)
server.on("/executar", HTTP_POST, [](AsyncWebServerRequest * request) {}, NULL, 
  [](AsyncWebServerRequest * request, uint8_t *data, size_t len, size_t index, size_t total) {
    
    String body = String((char*)data).substring(0, len);
    Serial.print("Recebido comando: ");
    Serial.println(body);
    
    // Parse JSON: {"comando":"ROTA_1"}
    if (body.indexOf("\"comando\":\"ROTA_1\"") > 0 || body.indexOf("ROTA_1") > 0) {
        iniciarRota(rota1, sizeof(rota1) / sizeof(Comando), "ROTA 1");
        // CORREÇÃO: CORS na resposta
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_1\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else if (body.indexOf("\"comando\":\"ROTA_2\"") > 0 || body.indexOf("ROTA_2") > 0) {
        iniciarRota(rota2, sizeof(rota2) / sizeof(Comando), "ROTA 2");
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_2\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else if (body.indexOf("\"comando\":\"ROTA_3\"") > 0 || body.indexOf("ROTA_3") > 0) {
        iniciarRota(rota3, sizeof(rota3) / sizeof(Comando), "ROTA 3");
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_3\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else if (body.indexOf("\"comando\":\"ROTA_4\"") > 0 || body.indexOf("ROTA_4") > 0) {
        iniciarRota(rota4, sizeof(rota4) / sizeof(Comando), "ROTA 4");
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_4\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else if (body.indexOf("\"comando\":\"ROTA_5\"") > 0 || body.indexOf("ROTA_5") > 0) {
        iniciarRota(rota5, sizeof(rota5) / sizeof(Comando), "ROTA 5");
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_5\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else if (body.indexOf("\"comando\":\"ROTA_6\"") > 0 || body.indexOf("ROTA_6") > 0) {
        iniciarRota(rota6, sizeof(rota6) / sizeof(Comando), "ROTA 6");
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_6\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else if (body.indexOf("\"comando\":\"ROTA_7\"") > 0 || body.indexOf("ROTA_7") > 0) {
        iniciarRota(rota7, sizeof(rota7) / sizeof(Comando), "ROTA 7");
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_7\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else if (body.indexOf("\"comando\":\"STOP\"") > 0 || body.indexOf("STOP") > 0) {
        Serial.println("=== PARADA MANUAL ===");
        pararTrajeto();
        AsyncWebServerResponse *response = request->beginResponse(200, "application/json", "{\"status\":\"ok\",\"acao\":\"STOP\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
    else {
        AsyncWebServerResponse *response = request->beginResponse(400, "application/json", "{\"error\":\"comando desconhecido\"}");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
    }
});

// Endpoint OPTIONS para CORS preflight
server.on("/executar", HTTP_OPTIONS, [](AsyncWebServerRequest * request) {
    AsyncWebServerResponse *response = request->beginResponse(200);
    response->addHeader("Access-Control-Allow-Origin", "*");
    response->addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response->addHeader("Access-Control-Allow-Headers", "Content-Type");
    request->send(response);
});
  
  // Status endpoint
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest * request) {
    String status = trajetoRodando ? "executando" : "parado";
    String json = "{\"status\":\"" + status + "\",\"conectado\":true}";
    request->send(200, "application/json", json);
    Serial.println("Status requisitado: " + status);
  });

}

// ========== SETUP ==========

void setup() {
  // Inicializa a comunicação Serial na frequência 115200.
  Serial.begin(115200);
  Serial.println("\n=================================");
  Serial.println("Robo Entregador Autonomo ESP8266");
  Serial.println("ExpoTech 2025 - UNIFECAF");
  Serial.println("=================================\n");
  
  // Conecta-se à sua rede doméstica
  WiFi.begin(homeSSID, homePassword);
  Serial.println("Conectando à rede doméstica...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Conectado à rede doméstica!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
  
  // Inicializa a ESP8266 como um ponto de Acesso.
  WiFi.softAP(apSSID, apPassword);
  Serial.println("Ponto de Acesso ativo.");
  Serial.print("Endereço IP do Ponto de Acesso: ");
  Serial.println(WiFi.softAPIP());
  
  // Informa caso ocorra um erro ao montar os arquivos SPIFFS.
  if (!SPIFFS.begin()) {
    Serial.println("Ocorreu um erro ao montar os arquivos SPIFFS.");
    return;
  }
  
  // Configura os pinos dos motores como saída.
  pinMode(pinMotor1F, OUTPUT);
  pinMode(pinMotor1T, OUTPUT);
  pinMode(pinMotor2F, OUTPUT);
  pinMode(pinMotor2T, OUTPUT);
  
  // Para os motores inicialmente
  controlMotor(4); // Inicia os motores parados
  
  // Configura rotas do servidor web
  configurarRotasWeb();
  
  server.begin();
  Serial.println("✅ Servidor HTTP iniciado na porta 80");
  Serial.println("=== PRONTO PARA RECEBER COMANDOS ===\n");
}

// ========== LOOP PRINCIPAL ==========

void loop() {
  unsigned long agora = millis();
  
  // Verifica se terminou um comando
  if (executando && agora >= fimComando) {
    controlar_motores(4); // Para o motor
    executando = false;

    Serial.println(">>> PASSO TERMINADO");

    if (trajetoRodando) {
      pausandoEntrePassos = true;
      fimDaPausa = agora + 1000;  // PAUSA DE 1s ENTRE PASSOS
      Serial.println(">>> PAUSA DE 1s ANTES DO PRÓXIMO PASSO");
    }
  }
  
  // Verifica se terminou a pausa entre passos
  if (pausandoEntrePassos && agora >= fimDaPausa) {
    pausandoEntrePassos = false;
    executarProximoComando();
  }
  
  delay(10);
}
