# 🤖 Firmware ESP8266 - Robô Entregador Autônomo

Firmware para NodeMCU ESP8266 que controla o robô entregador autônomo via comandos HTTP.

## 📋 Características

- ✅ Recebe comandos via Interface Web (HTTP POST)
- ✅ 7 rotas pré-programadas com movimentos otimizados
- ✅ Controle de 2 motores DC via Motor Shield
- ✅ Servidor HTTP na porta 80
- ✅ Página web de status e informações
- ✅ Execução sequencial de comandos
- ✅ Feedback via Serial Monitor

## 🔧 Hardware Necessário

- **NodeMCU ESP8266** (microcontrolador)
- **Motor Shield para NodeMCU ESP8266 V2**
- **2x Motores DC**
- **Baterias de Lítio** (alimentação)
- **Chassi do robô**

## 📌 Conexões dos Pinos

```
Motor Esquerdo:
- D1 (GPIO5)  → Motor1A (Frente)
- D2 (GPIO4)  → Motor1B (Trás)

Motor Direito:
- D3 (GPIO0)  → Motor2A (Frente)
- D4 (GPIO2)  → Motor2B (Trás)
```

## 🚀 Como Usar

### 1. Configurar WiFi

Edite as linhas no arquivo `.ino`:

```cpp
const char* ssid = "SUA_REDE_WIFI";        // Nome da sua rede
const char* password = "SUA_SENHA_WIFI";   // Senha da rede
```

### 2. Upload do Código

1. Abra o arquivo `robo_entregador_esp8266.ino` no **Arduino IDE**
2. Selecione a placa: **Tools → Board → NodeMCU 1.0 (ESP-12E Module)**
3. Selecione a porta COM correta
4. Clique em **Upload** (→)

### 3. Verificar Conexão

1. Abra o **Serial Monitor** (115200 baud)
2. Aguarde a mensagem com o IP do ESP8266:
   ```
   ✅ WiFi conectado!
   📡 IP do ESP8266: 192.168.1.XXX
   ```
3. Anote o endereço IP

### 4. Testar no Navegador

Acesse `http://192.168.1.XXX` (substitua pelo IP do seu ESP8266)

Você verá uma página com:
- Status atual (Executando/Parado)
- Lista das 7 rotas disponíveis
- Instruções de uso

## 📡 API HTTP

### Executar Rota

**Endpoint:** `POST /executar`  
**Content-Type:** `application/json`

**Exemplos de comandos:**

```bash
# Rota 1 (mais rápida - 157.5cm)
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"ROTA_1"}'

# Rota 7 (mais longa - 336.5cm)
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"ROTA_7"}'

# Parar execução
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"STOP"}'
```

### Verificar Status

**Endpoint:** `GET /status`

```bash
curl http://192.168.1.XXX/status
```

**Resposta:**
```json
{
  "status": "parado",
  "conectado": true
}
```

## 🗺️ Rotas Disponíveis

| Comando | Caminho | Distância | Tempo | Comandos |
|---------|---------|-----------|-------|----------|
| ROTA_1 | A → B → E → G | 157.5 cm | ~15.8s | 5 |
| ROTA_2 | A → B → D → E → G | 198 cm | ~19.8s | 7 |
| ROTA_3 | A → C → F → G | 181 cm | ~18.1s | 5 |
| ROTA_4 | A → C → D → E → G | 216 cm | ~21.6s | 7 |
| ROTA_5 | A → B → D → C → F → G | 287 cm | ~28.7s | 9 |
| ROTA_6 | A → C → D → B → E → G | 295.5 cm | ~29.6s | 9 |
| ROTA_7 | A → B → E → D → C → F → G | 336.5 cm | ~33.7s | 11 |

## 🎮 Comandos de Movimento

Cada rota é composta por uma sequência de comandos:

- **0 = Frente** - Move o robô para frente
- **1 = Ré** - Move o robô para trás
- **2 = Direita** - Gira o robô para direita
- **3 = Esquerda** - Gira o robô para esquerda
- **4 = Parar** - Para todos os motores

### Exemplo: ROTA_1

```cpp
{0, 4900},   // Frente 4.9s (49cm - A→B)
{2, 500},    // Direita 0.5s (curva)
{0, 6450},   // Frente 6.45s (64.5cm - B→E)
{3, 500},    // Esquerda 0.5s (curva)
{0, 4400}    // Frente 4.4s (44cm - E→G)
```

## 🔍 Debug via Serial Monitor

O firmware envia informações detalhadas via Serial:

```
=== EXECUTANDO ROTA 1 ===
INICIANDO ROTA com 5 comandos
Comando 1/5 - Direcao: 0 Duracao: 4900ms
>>> FRENTE
Comando 2/5 - Direcao: 2 Duracao: 500ms
>>> DIREITA
...
=== ROTA FINALIZADA ===
```

## ⚙️ Ajustes e Calibração

### Velocidade dos Motores

Os tempos foram calculados para velocidade de **~10 cm/s**.

Se o robô estiver mais rápido ou lento, ajuste os valores de duração:

```cpp
// Exemplo: Se o robô está 20% mais rápido
{0, 4900}  →  {0, 4080}  // 4900 * 0.8 = 3920ms
```

### Ângulo das Curvas

Ajuste o tempo das curvas (direita/esquerda):

```cpp
{2, 500}   // Curva suave (90°)
{2, 700}   // Curva acentuada (120°+)
```

### Criar Nova Rota

Para adicionar uma rota personalizada:

```cpp
// ROTA 8: Seu caminho personalizado
Comando rota8[] = {
  {0, 5000},   // Frente 5s
  {2, 600},    // Direita
  {0, 3000},   // Frente 3s
  {4, 1000}    // Parar 1s
};

// No handleExecutar(), adicione:
else if (body.indexOf("ROTA_8") > 0) {
  iniciarRota(rota8, sizeof(rota8) / sizeof(Comando));
  server.send(200, "application/json", "{\"status\":\"ok\",\"rota\":\"ROTA_8\"}");
}
```

## 🐛 Troubleshooting

### ESP8266 não conecta ao WiFi
- Verifique SSID e senha
- Certifique-se que a rede é 2.4GHz (ESP8266 não suporta 5GHz)
- Verifique se o roteador permite novos dispositivos

### Motores não se movem
- Verifique as conexões dos pinos
- Teste a alimentação das baterias
- Verifique se o Motor Shield está corretamente encaixado

### Robô não segue o caminho correto
- Calibre os tempos de movimento
- Ajuste os ângulos das curvas
- Verifique se o piso está nivelado

### Backend não consegue enviar comandos
- Verifique se o IP está correto no `application.properties`
- Teste manualmente com `curl` primeiro
- Verifique se o firewall não está bloqueando

## 📚 Bibliotecas Necessárias

As seguintes bibliotecas já vêm com o Arduino IDE para ESP8266:

- `ESP8266WiFi.h` - Conexão WiFi
- `ESP8266WebServer.h` - Servidor HTTP

### Instalar Suporte ESP8266

1. Arduino IDE → **File → Preferences**
2. Em "Additional Board Manager URLs", adicione:
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
3. **Tools → Board → Boards Manager**
4. Procure por "esp8266" e instale

## 👥 Equipe

- Felipe Bergamin Dantas - 103538
- Rafael Alves Oliveira - 76601
- Kauã Rodrigues Lessa - 101338
- Cauã Bordin - 71765
- Luís Henrique Lisboa Marques - 77215

**UNIFECAF - Engenharia da Computação - 4º Semestre**  
**ExpoTech 2025**

## 📄 Licença

Projeto acadêmico - UNIFECAF 2025
