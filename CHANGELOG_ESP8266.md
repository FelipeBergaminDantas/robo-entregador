# Changelog - Atualização ESP32 → ESP8266

## Data: 26 de Novembro de 2025

### Resumo
Atualização completa do projeto para refletir o uso do **ESP8266** ao invés do ESP32, conforme a documentação oficial do projeto ExpoTech 2025.

---

## 📝 Alterações Realizadas

### 1. Documentação Principal

#### README.md
- ✅ Atualizado título e descrição do hardware (ESP8266 com firmware em C++)
- ✅ Arquitetura do sistema redesenhada
- ✅ Seção de hardware atualizada com especificações do ESP8266
- ✅ Motor Shield para NodeMCU ESP8266 V2 documentado
- ✅ Baterias de Lítio como fonte de alimentação
- ✅ Todas as referências ESP32 → ESP8266
- ✅ Funcionalidades atualizadas (Interface WEB ao invés de Serial)

#### backend/ESP8266_CONFIG.md (novo)
- ✅ Criado arquivo de configuração específico para ESP8266
- ✅ Exemplo de código Arduino/C++ para ESP8266
- ✅ Documentação de hardware e conexões
- ✅ Especificações técnicas do ESP8266
- ✅ Instruções de configuração do Motor Shield

#### backend/ESP32_CONFIG.md
- ✅ Arquivo removido (substituído por ESP8266_CONFIG.md)

---

### 2. Backend (Java/Spring Boot)

#### Configuração
**backend/src/main/resources/application.properties**
- ✅ `esp32.host` → `esp8266.host`
- ✅ `esp32.port` → `esp8266.port`
- ✅ `esp32.timeout` → `esp8266.timeout`
- ✅ `esp32.dev.mode` → `esp8266.dev.mode`

#### Services
**Esp32Service.java → Esp8266Service.java**
- ✅ Classe renomeada
- ✅ Todas as variáveis atualizadas (esp32Host → esp8266Host)
- ✅ Mensagens de log atualizadas
- ✅ Comentários de documentação atualizados

**RotaService.java**
- ✅ Injeção de dependência atualizada (Esp32Service → Esp8266Service)
- ✅ Mensagens de erro atualizadas
- ✅ Comentários atualizados

#### Controllers
**Esp32Controller.java → Esp8266Controller.java**
- ✅ Classe renomeada
- ✅ Endpoint atualizado: `/api/esp32/status` → `/api/esp8266/status`
- ✅ Mensagens de resposta atualizadas

#### Models (Rotas)
**Rota.java, Rota1.java até Rota7.java**
- ✅ Comentários JavaDoc atualizados
- ✅ "ESP32 será responsável" → "ESP8266 será responsável"

#### Build
**pom.xml**
- ✅ Descrição do projeto atualizada

#### Scripts
**test-api.bat**
- ✅ Endpoint de teste atualizado para `/api/esp8266/status`

---

### 3. Frontend (React/TypeScript)

#### Componentes
**frontend/src/components/RouteList.tsx**
- ✅ Mensagem de toast atualizada
- ✅ "ESP32 não conectada" → "ESP8266 não conectada"

---

### 4. Firmware (C++ / Arduino)

#### firmware/robo_entregador_esp8266.ino ⭐ NOVO
- ✅ Código completo do firmware ESP8266
- ✅ Servidor HTTP na porta 80
- ✅ Recebe comandos via POST /executar
- ✅ 7 rotas pré-programadas com movimentos otimizados
- ✅ Controle de 2 motores DC
- ✅ Execução sequencial de comandos
- ✅ Sistema de feedback via Serial
- ✅ Página web de status (GET /)
- ✅ Endpoint de status (GET /status)

**Estrutura das Rotas:**
- Cada rota contém array de comandos {direção, duração}
- Direções: 0=Frente, 1=Ré, 2=Direita, 3=Esquerda, 4=Parar
- Durações calculadas baseadas em velocidade ~10cm/s
- Curvas com tempos ajustados (500-700ms)

**Exemplo ROTA_1:**
```cpp
Comando rota1[] = {
  {0, 4900},   // Frente 4.9s (49cm - A→B)
  {2, 500},    // Direita 0.5s (curva)
  {0, 6450},   // Frente 6.45s (64.5cm - B→E)
  {3, 500},    // Esquerda 0.5s (curva)
  {0, 4400}    // Frente 4.4s (44cm - E→G)
};
```

#### firmware/README.md ⭐ NOVO
- ✅ Documentação completa do firmware
- ✅ Instruções de instalação e configuração
- ✅ Guia de conexões de hardware
- ✅ Exemplos de uso da API HTTP
- ✅ Tabela com todas as 7 rotas
- ✅ Seção de troubleshooting
- ✅ Guia de calibração e ajustes

---

## 🔧 Especificações Técnicas Atualizadas

### Hardware ESP8266
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

### Componentes do Sistema
- NodeMCU ESP8266 (microcontrolador)
- Motor Shield para NodeMCU ESP8266 V2
- 2x Motores DC
- Baterias de Lítio (alimentação)
- Sensores analógicos e digitais
- Chassi do carrinho

---

## ✅ Verificações Realizadas

- ✅ Compilação do backend sem erros
- ✅ Nenhuma referência a ESP32 restante no código
- ✅ Todos os comentários atualizados
- ✅ Documentação consistente
- ✅ Endpoints da API atualizados
- ✅ Mensagens de usuário atualizadas

---

## 📚 Arquivos Modificados

### Criados
- `backend/ESP8266_CONFIG.md`
- `CHANGELOG_ESP8266.md`
- `firmware/robo_entregador_esp8266.ino` ⭐ NOVO
- `firmware/README.md` ⭐ NOVO

### Removidos
- `backend/ESP32_CONFIG.md`
- `backend/src/main/java/com/roboentregador/backend/service/Esp32Service.java`
- `backend/src/main/java/com/roboentregador/backend/controller/Esp32Controller.java`

### Modificados
- `README.md`
- `backend/pom.xml`
- `backend/test-api.bat`
- `backend/src/main/resources/application.properties`
- `backend/src/main/java/com/roboentregador/backend/service/RotaService.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota1.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota2.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota3.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota4.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota5.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota6.java`
- `backend/src/main/java/com/roboentregador/backend/model/Rota7.java`
- `frontend/src/components/RouteList.tsx`

### Adicionados
- `backend/src/main/java/com/roboentregador/backend/service/Esp8266Service.java`
- `backend/src/main/java/com/roboentregador/backend/controller/Esp8266Controller.java`

---

## 🎯 Próximos Passos

1. Testar a compilação do backend: `cd backend && ./mvnw clean install`
2. Testar o frontend: `cd frontend && npm run dev`
3. Configurar o ESP8266 conforme `firmware/README.md`
4. Fazer upload do firmware: `firmware/robo_entregador_esp8266.ino`
5. Configurar WiFi no código (SSID e senha)
6. Anotar o IP do ESP8266 no Serial Monitor
7. Atualizar `backend/src/main/resources/application.properties` com o IP
8. Testar a comunicação entre backend e ESP8266

---

## 👥 Equipe

- Felipe Bergamin Dantas - 103538
- Rafael Alves Oliveira - 76601
- Kauã Rodrigues Lessa - 101338
- Cauã Bordin - 71765
- Luís Henrique Lisboa Marques - 77215

**UNIFECAF - Engenharia da Computação - 4º Semestre**  
**ExpoTech 2025**
