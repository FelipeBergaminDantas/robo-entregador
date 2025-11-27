/**
 * Robô Entregador Autônomo - Firmware ESP8266
 * ExpoTech 2025 - UNIFECAF
 * 
 * Recebe comandos de rotas via Interface Web (HTTP)
 * Executa movimentos baseados nas 7 rotas do grafo
 * 
 * Hardware:
 * - NodeMCU ESP8266
 * - Motor Shield para NodeMCU ESP8266 V2
 * - 2x Motores DC
 * - Baterias de Lítio
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// ========== CONFIGURAÇÃO WIFI ==========
const char* ssid = "SUA_REDE_WIFI";        // Altere para sua rede
const char* password = "SUA_SENHA_WIFI";   // Altere para sua senha

// ========== PINOS DOS MOTORES ==========
const int pinMotor1A = 5;   // D1 - Motor Esquerdo Frente
const int pinMotor1B = 4;   // D2 - Motor Esquerdo Trás
const int pinMotor2A = 0;   // D3 - Motor Direito Frente
const int pinMotor2B = 2;   // D4 - Motor Direito Trás

// ========== SERVIDOR WEB ==========
ESP8266WebServer server(80);

// ========== SISTEMA DE EXECUÇÃO ==========
bool executando = false;
int comandoAtual = -1;
unsigned long fimComando = 0;

// ========== SISTEMA DO COMANDO RETO ==========
bool emReto = false;
unsigned long proximaAcao = 0;
bool virarParaDireita = false;
bool primeiraCorrecao = true;
bool emPausa = false;

// ========== ESTRUTURA DE COMANDO ==========
struct Comando {
  int direcao;      // 0=Frente, 1=Ré, 2=Direita, 3=Esquerda, 4=Parar, 5=Reto
  int duracao;      // Duração em milissegundos
};

// ========== ÍNDICE DE COMANDOS ==========
int indiceComandoAtual = 0;
int totalComandos = 0;
Comando* comandosRota = nullptr;

// ========== DEFINIÇÃO DAS ROTAS ==========
// Baseado nas distâncias reais do grafo (velocidade ~10cm/s)

// ROTA 1: A → B → E → G (157.5cm = 15.8s)
// Caminho mais curto e direto
Comando rota1[] = {
  {0, 4900},   // Frente 4.9s (49cm - A→B)
  {2, 500},    // Direita 0.5s (curva)
  {0, 6450},   // Frente 6.45s (64.5cm - B→E)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 4400}    // Frente 4.4s (44cm - E→G)
};

// ROTA 2: A → B → D → E → G (198cm = 19.8s)
Comando rota2[] = {
  {0, 4900},   // Frente 4.9s (49cm - A→B)
  {3, 600},    // Esquerda 0.6s (curva)
  {0, 6000},   // Frente 6s (60cm - B→D)
  {2, 500},    // Direita 0.5s (curva)
  {0, 4500},   // Frente 4.5s (45cm - D→E)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 4400}    // Frente 4.4s (44cm - E→G)
};

// ROTA 3: A → C → F → G (181cm = 18.1s)
Comando rota3[] = {
  {0, 6500},   // Frente 6.5s (65cm - A→C)
  {2, 600},    // Direita 0.6s (curva)
  {0, 6100},   // Frente 6.1s (61cm - C→F)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 5500}    // Frente 5.5s (55cm - F→G)
};

// ROTA 4: A → C → D → E → G (216cm = 21.6s)
Comando rota4[] = {
  {0, 6500},   // Frente 6.5s (65cm - A→C)
  {3, 600},    // Esquerda 0.6s (curva)
  {0, 6200},   // Frente 6.2s (62cm - C→D)
  {2, 500},    // Direita 0.5s (curva)
  {0, 4500},   // Frente 4.5s (45cm - D→E)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 4400}    // Frente 4.4s (44cm - E→G)
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
// Rota mais longa
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

void controlar_motores(int direcao) {
  switch (direcao) {
    case 0: // Frente
      Serial.println(">>> FRENTE");
      digitalWrite(pinMotor2A, LOW);
      digitalWrite(pinMotor2B, HIGH);
      digitalWrite(pinMotor1A, HIGH);
      digitalWrite(pinMotor1B, HIGH);
      break;
      
    case 1: // Ré
      Serial.println(">>> RE");
      digitalWrite(pinMotor2A, HIGH);
      digitalWrite(pinMotor2B, LOW);
      digitalWrite(pinMotor1A, HIGH);
      digitalWrite(pinMotor1B, HIGH);
      break;
      
    case 2: // Direita
      Serial.println(">>> DIREITA");
      digitalWrite(pinMotor2A, HIGH);
      digitalWrite(pinMotor2B, HIGH);
      digitalWrite(pinMotor1A, HIGH);
      digitalWrite(pinMotor1B, HIGH);
      break;
      
    case 3: // Esquerda
      Serial.println(">>> ESQUERDA");
      digitalWrite(pinMotor2A, LOW);
      digitalWrite(pinMotor2B, LOW);
      digitalWrite(pinMotor1A, HIGH);
      digitalWrite(pinMotor1B, HIGH);
      break;
      
    case 4: // Parar
      Serial.println(">>> PARAR");
      digitalWrite(pinMotor1A, LOW);
      digitalWrite(pinMotor1B, LOW);
      digitalWrite(pinMotor2A, LOW);
      digitalWrite(pinMotor2B, LOW);
      break;
      
    default:
      Serial.println(">>> COMANDO INVALIDO");
      break;
  }
}

// ========== FUNÇÕES DE EXECUÇÃO DE ROTAS ==========

void iniciarRota(Comando* rota, int tamanho) {
  if (executando) {
    Serial.println("AVISO: Ja esta executando uma rota");
    return;
  }
  
  comandosRota = rota;
  totalComandos = tamanho;
  indiceComandoAtual = 0;
  executando = true;
  
  Serial.print("INICIANDO ROTA com ");
  Serial.print(totalComandos);
  Serial.println(" comandos");
  
  // Executa primeiro comando
  executarProximoComando();
}

void executarProximoComando() {
  if (indiceComandoAtual >= totalComandos) {
    // Rota finalizada
    Serial.println("=== ROTA FINALIZADA ===");
    controlar_motores(4); // Para
    executando = false;
    comandosRota = nullptr;
    return;
  }
  
  Comando cmd = comandosRota[indiceComandoAtual];
  
  Serial.print("Comando ");
  Serial.print(indiceComandoAtual + 1);
  Serial.print("/");
  Serial.print(totalComandos);
  Serial.print(" - Direcao: ");
  Serial.print(cmd.direcao);
  Serial.print(" Duracao: ");
  Serial.print(cmd.duracao);
  Serial.println("ms");
  
  controlar_motores(cmd.direcao);
  fimComando = millis() + cmd.duracao;
  indiceComandoAtual++;
}

// ========== HANDLERS HTTP ==========

void handleExecutar() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    Serial.print("Recebido comando: ");
    Serial.println(body);
    
    // Parse JSON simples: {"comando":"ROTA_1"}
    if (body.indexOf("ROTA_1") > 0) {
      Serial.println("=== EXECUTANDO ROTA 1 ===");
      iniciarRota(rota1, sizeof(rota1) / sizeof(Comando));
      server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_1\"}");
    }
    else if (body.indexOf("ROTA_2") > 0) {
      Serial.println("=== EXECUTANDO ROTA 2 ===");
      iniciarRota(rota2, sizeof(rota2) / sizeof(Comando));
      server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_2\"}");
    }
    else if (body.indexOf("ROTA_3") > 0) {
      Serial.println("=== EXECUTANDO ROTA 3 ===");
      iniciarRota(rota3, sizeof(rota3) / sizeof(Comando));
      server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_3\"}");
    }
    else if (body.indexOf("ROTA_4") > 0) {
      Serial.println("=== EXECUTANDO ROTA 4 ===");
      iniciarRota(rota4, sizeof(rota4) / sizeof(Comando));
      server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_4\"}");
    }
    else if (body.indexOf("ROTA_5") > 0) {
      Serial.println("=== EXECUTANDO ROTA 5 ===");
      iniciarRota(rota5, sizeof(rota5) / sizeof(Comando));
      server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_5\"}");
    }
    else if (body.indexOf("ROTA_6") > 0) {
      Serial.println("=== EXECUTANDO ROTA 6 ===");
      iniciarRota(rota6, sizeof(rota6) / sizeof(Comando));
      server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_6\"}");
    }
    else if (body.indexOf("ROTA_7") > 0) {
      Serial.println("=== EXECUTANDO ROTA 7 ===");
      iniciarRota(rota7, sizeof(rota7) / sizeof(Comando));
      server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_7\"}");
    }
    else if (body.indexOf("STOP") > 0) {
      Serial.println("=== PARADA MANUAL ===");
      controlar_motores(4);
      executando = false;
      comandosRota = nullptr;
      server.send(200, "application/json", "{\"status\":\"ok\",\"acao\":\"STOP\"}");
    }
    else {
      server.send(400, "application/json", "{\"error\":\"comando desconhecido\"}");
    }
  } else {
    server.send(400, "application/json", "{\"error\":\"no command\"}");
  }
}

void handleStatus() {
  String status = executando ? "executando" : "parado";
  String json = "{\"status\":\"" + status + "\",\"conectado\":true}";
  server.send(200, "application/json", json);
  Serial.println("Status requisitado: " + status);
}

void handleRoot() {
  String html = "<html><head><title>Robo Entregador ESP8266</title></head>";
  html += "<body><h1>Robo Entregador Autonomo</h1>";
  html += "<p>Status: " + String(executando ? "Executando" : "Parado") + "</p>";
  html += "<p>IP: " + WiFi.localIP().toString() + "</p>";
  html += "<h2>Rotas Disponiveis:</h2>";
  html += "<ul>";
  html += "<li>ROTA_1: A → B → E → G (157.5cm)</li>";
  html += "<li>ROTA_2: A → B → D → E → G (198cm)</li>";
  html += "<li>ROTA_3: A → C → F → G (181cm)</li>";
  html += "<li>ROTA_4: A → C → D → E → G (216cm)</li>";
  html += "<li>ROTA_5: A → B → D → C → F → G (287cm)</li>";
  html += "<li>ROTA_6: A → C → D → B → E → G (295.5cm)</li>";
  html += "<li>ROTA_7: A → B → E → D → C → F → G (336.5cm)</li>";
  html += "</ul>";
  html += "<p>Envie POST para /executar com JSON: {\"comando\":\"ROTA_X\"}</p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// ========== SETUP ==========

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=================================");
  Serial.println("Robo Entregador Autonomo ESP8266");
  Serial.println("ExpoTech 2025 - UNIFECAF");
  Serial.println("=================================\n");
  
  // Configura pinos dos motores
  pinMode(pinMotor1A, OUTPUT);
  pinMode(pinMotor1B, OUTPUT);
  pinMode(pinMotor2A, OUTPUT);
  pinMode(pinMotor2B, OUTPUT);
  
  controlar_motores(4); // Para os motores inicialmente
  
  // Conecta ao WiFi
  Serial.print("Conectando ao WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int tentativas = 0;
  while (WiFi.status() != WL_CONNECTED && tentativas < 30) {
    delay(500);
    Serial.print(".");
    tentativas++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi conectado!");
    Serial.print("📡 IP do ESP8266: ");
    Serial.println(WiFi.localIP());
    Serial.print("🌐 Acesse: http://");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ Falha ao conectar WiFi");
    Serial.println("Verifique SSID e senha");
  }
  
  // Configura rotas do servidor web
  server.on("/", handleRoot);
  server.on("/executar", HTTP_POST, handleExecutar);
  server.on("/status", HTTP_GET, handleStatus);
  
  server.begin();
  Serial.println("✅ Servidor HTTP iniciado na porta 80");
  Serial.println("\n=== PRONTO PARA RECEBER COMANDOS ===\n");
}

// ========== LOOP PRINCIPAL ==========

void loop() {
  server.handleClient();
  
  unsigned long agora = millis();
  
  // Verifica se precisa executar próximo comando
  if (executando && agora >= fimComando) {
    executarProximoComando();
  }
  
  delay(10);
}
