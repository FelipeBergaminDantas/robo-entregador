# ⚡ Configuração Rápida - Sistema Integrado

## 🎯 Objetivo
Integrar o firmware do seu colega com o sistema de rotas do backend.

## 📋 Pré-requisitos
- ESP8266 com o firmware atualizado
- Backend rodando
- Frontend rodando
- Todos na mesma rede WiFi

---

## 🔧 Passo 1: Configurar WiFi no ESP8266

Edite o arquivo `firmware/robo_entregador_esp8266.ino`:

```cpp
// ========== CONFIGURAÇÃO WIFI ==========
const char* homeSSID = "SUA_REDE_WIFI";        // ⚠️ ALTERE AQUI
const char* homePassword = "SUA_SENHA_WIFI";   // ⚠️ ALTERE AQUI
const char* apSSID = "RoboEntregador";          
const char* apPassword = "12345678";            
```

---

## 🚀 Passo 2: Upload do Firmware

1. Abra `firmware/robo_entregador_esp8266.ino` no Arduino IDE
2. Selecione a placa: **NodeMCU 1.0 (ESP-12E Module)**
3. Faça upload (→)
4. Abra Serial Monitor (115200 baud)
5. **Anote o IP exibido** (ex: 192.168.1.105)

```
Conectado à rede doméstica!
Endereço IP: 192.168.1.105  ← ANOTE ESTE IP
```

---

## ⚙️ Passo 3: Configurar Backend

Edite `backend/src/main/resources/application.properties`:

```properties
# Configuração da ESP8266
esp8266.host=192.168.1.105  ← COLOQUE O IP DO SEU ESP8266
esp8266.port=80
esp8266.timeout=5000

# Modo de produção (envia comandos reais)
esp8266.dev.mode=false
```

---

## 🏃‍♂️ Passo 4: Iniciar Sistema

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## 🧪 Passo 5: Testar Integração

### Teste 1: Via Frontend
1. Acesse `http://localhost:8081`
2. Selecione uma rota
3. Clique no botão Play ▶️
4. Observe:
   - ✅ Animação no frontend
   - ✅ Toast de confirmação
   - ✅ ESP8266 executando (Serial Monitor)
   - ✅ Robô se movendo

### Teste 2: Via API Backend
```bash
curl -X POST http://localhost:8080/api/rotas/1/executar
```

### Teste 3: Direto no ESP8266
```bash
curl -X POST http://192.168.1.105/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"ROTA_1"}'
```

---

## 🔄 Fluxo Completo

```
Frontend → Backend → ESP8266 → Motores → Movimento
   ↓         ↓         ↓         ↓         ↓
 Clique   API Call   HTTP     GPIO     Robô se
  Play    /executar  /executar Signals   move
```

### Detalhado:

1. **Usuário clica Play** no frontend
2. **Frontend envia** `POST /api/rotas/1/executar` para backend
3. **Backend processa** e envia `{"comando":"ROTA_1"}` para ESP8266
4. **ESP8266 recebe** comando via `/executar`
5. **ESP8266 executa** sequência de movimentos da ROTA_1
6. **Motores se movem** conforme programado
7. **Robô percorre** o caminho A → B → E → G

---

## 🎮 Comandos Disponíveis

| Comando | Rota | Caminho | Distância |
|---------|------|---------|-----------|
| ROTA_1 | 1 | A → B → E → G | 157.5cm |
| ROTA_2 | 2 | A → B → D → E → G | 198cm |
| ROTA_3 | 3 | A → C → F → G | 181cm |
| ROTA_4 | 4 | A → C → D → E → G | 216cm |
| ROTA_5 | 5 | A → B → D → C → F → G | 287cm |
| ROTA_6 | 6 | A → C → D → B → E → G | 295.5cm |
| ROTA_7 | 7 | A → B → E → D → C → F → G | 336.5cm |
| STOP | - | Parada de emergência | - |

---

## 🐛 Troubleshooting

### ❌ ESP8266 não conecta WiFi
- Verifique SSID e senha
- Use rede 2.4GHz (não 5GHz)
- Reinicie o ESP8266

### ❌ Backend não envia comandos
- Verifique IP no `application.properties`
- Teste: `curl http://192.168.1.105/status`
- Verifique se `esp8266.dev.mode=false`

### ❌ Robô não se move
- Verifique conexões dos motores
- Teste bateria
- Observe Serial Monitor para debug

### ❌ Frontend não funciona
- Verifique se backend está rodando
- Abra DevTools (F12) → Console
- Verifique se frontend está na porta 8081

---

## ✅ Checklist de Funcionamento

- [ ] ESP8266 conectado ao WiFi
- [ ] IP do ESP8266 anotado
- [ ] Backend configurado com IP correto
- [ ] Backend rodando na porta 8080
- [ ] Frontend rodando na porta 8081
- [ ] Teste direto no ESP8266 funciona
- [ ] Teste via backend funciona
- [ ] Teste via frontend funciona
- [ ] Robô se move fisicamente

---

## 🎉 Sistema Funcionando!

Quando tudo estiver funcionando:

1. **Interface Web** → Clique em qualquer rota
2. **Animação** → Visualize no grafo
3. **Robô Real** → Se move fisicamente
4. **Feedback** → Toast de confirmação

**Parabéns! Seu sistema está integrado! 🚀**

---

## 📞 Suporte

Se algo não funcionar:

1. Verifique Serial Monitor do ESP8266
2. Verifique console do backend
3. Verifique DevTools do frontend
4. Teste cada componente separadamente
5. Verifique se todos estão na mesma rede

---

## 👥 Equipe

- Felipe Bergamin Dantas - 103538
- Rafael Alves Oliveira - 76601
- Kauã Rodrigues Lessa - 101338
- Cauã Bordin - 71765
- Luís Henrique Lisboa Marques - 77215

**UNIFECAF - Engenharia da Computação - 4º Semestre**  
**ExpoTech 2025**