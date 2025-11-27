# 🔌 Configuração da ESP8266

## Como Configurar a Conexão

Edite o arquivo `src/main/resources/application.properties`:

```properties
# IP da sua ESP8266 na rede
esp8266.host=192.168.1.100

# Porta HTTP da ESP8266 (padrão: 80)
esp8266.port=80

# Timeout de conexão em milissegundos
esp8266.timeout=5000

# Modo desenvolvimento (true = não precisa ESP8266 conectada)
esp8266.dev.mode=true
```

## Comandos Enviados

O backend envia comandos simples para a ESP8266:

- `ROTA_1` - Executa Rota 1 (A → B → E → G)
- `ROTA_2` - Executa Rota 2 (A → B → D → E → G)
- `ROTA_3` - Executa Rota 3 (A → C → F → G)
- `ROTA_4` - Executa Rota 4 (A → C → D → E → G)
- `ROTA_5` - Executa Rota 5 (A → B → D → C → F → G)
- `ROTA_6` - Executa Rota 6 (A → C → D → B → E → G)
- `ROTA_7` - Executa Rota 7 (A → B → E → D → C → F → G)

## Formato da Requisição HTTP

```http
POST http://192.168.1.100:80/executar
Content-Type: application/json

{
  "comando": "ROTA_1"
}
```

## Firmware da ESP8266

O firmware da ESP8266 deve:

1. **Criar servidor HTTP** na porta 80
2. **Receber requisições POST** em `/executar`
3. **Interpretar o comando** (ROTA_1, ROTA_2, etc)
4. **Executar os movimentos** definidos para cada rota
5. **Retornar status 200** quando concluir

### Exemplo de Código ESP8266 (Arduino/C++)

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA";

ESP8266WebServer server(80);

void handleExecutar() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    
    // Parse JSON simples
    if (body.indexOf("ROTA_1") > 0) {
      executarRota1();
    } else if (body.indexOf("ROTA_2") > 0) {
      executarRota2();
    }
    // ... outras rotas
    
    server.send(200, "application/json", "{\"status\":\"ok\"}");
  } else {
    server.send(400, "application/json", "{\"error\":\"no command\"}");
  }
}

void setup() {
  Serial.begin(115200);
  
  // Configurar pinos do Motor Shield
  pinMode(D1, OUTPUT); // Motor A
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT); // Motor B
  pinMode(D4, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  server.on("/executar", HTTP_POST, handleExecutar);
  server.begin();
}

void loop() {
  server.handleClient();
}

void executarRota1() {
  // Implementar movimentos: A → B → E → G
  // Distância: 157.5cm
  // Tempo: ~15.8s
  
  // Exemplo: frente por 3 segundos
  moverFrente();
  delay(3000);
  pararMotores();
}

void moverFrente() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, HIGH);
  digitalWrite(D4, LOW);
}

void pararMotores() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}

// ... implementar outras rotas
```

## Hardware Necessário

### Componentes
- **NodeMCU ESP8266** (microcontrolador)
- **Motor Shield para NodeMCU ESP8266 V2** (driver de motores)
- **2x Motores DC** (movimentação)
- **Baterias de Lítio** (alimentação)
- **Chassi do carrinho**
- **Sensores** (opcional: ultrassônico, infravermelho)

### Conexões
- Motor Shield conectado diretamente no NodeMCU ESP8266
- Motores conectados nas saídas do Motor Shield
- Baterias conectadas na entrada de alimentação

## Testando a Conexão

### 1. Verificar IP da ESP8266
```bash
# Windows
arp -a

# Linux/Mac
arp -scan
```

### 2. Testar Conexão
```bash
curl -X POST http://192.168.1.100:80/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"ROTA_1"}'
```

### 3. Verificar Logs do Backend
O backend mostra no console:
- ✅ `Comando enviado para ESP8266: ROTA_1`
- ⚠️ `ESP8266 não conectada - Comando não enviado: ROTA_1`

## Modo de Desenvolvimento

Com `esp8266.dev.mode=true`, o sistema funciona **sem ESP8266 conectada**:
- ✅ Animações funcionam normalmente
- ✅ Interface completa disponível
- ⚠️ Comandos não são enviados ao hardware

Ideal para:
- Desenvolvimento do frontend
- Testes de interface
- Demonstrações sem hardware

## Modo de Produção

Com `esp8266.dev.mode=false`:
- ✅ Comandos são enviados para ESP8266
- ✅ Verifica conexão antes de executar
- ❌ Retorna erro se ESP8266 não responder

## Especificações Técnicas

### ESP8266
- **Processador**: Tensilica L106 32-bit
- **Clock**: 80 MHz (pode ser aumentado para 160 MHz)
- **RAM**: 80 KB
- **Flash**: 4 MB (típico)
- **WiFi**: 802.11 b/g/n
- **GPIOs**: 11 pinos digitais
- **Tensão**: 3.3V

### Motor Shield para NodeMCU ESP8266 V2
- **Controle**: 2 motores DC ou 1 motor de passo
- **Corrente máxima**: 1A por canal
- **Tensão dos motores**: 4.5V - 9V
- **Interface**: Pinos digitais do ESP8266
