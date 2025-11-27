# 🚀 Guia Rápido de Início

Guia passo a passo para colocar o Robô Entregador Autônomo funcionando em 15 minutos.

## ⚡ Início Rápido (3 Passos)

### 1️⃣ Backend (2 minutos)

```bash
cd backend
./mvnw spring-boot:run
```

✅ Backend rodando em `http://localhost:8080`

### 2️⃣ Frontend (2 minutos)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend rodando em `http://localhost:8081`

### 3️⃣ ESP8266 (5 minutos)

1. Abra `firmware/robo_entregador_esp8266.ino` no Arduino IDE
2. Edite WiFi:
   ```cpp
   const char* ssid = "SUA_REDE";
   const char* password = "SUA_SENHA";
   ```
3. Upload para ESP8266 (→)
4. Abra Serial Monitor (115200 baud)
5. Anote o IP: `192.168.1.XXX`
6. Configure em `backend/src/main/resources/application.properties`:
   ```properties
   esp8266.host=192.168.1.XXX
   ```

✅ Sistema completo funcionando!

---

## 🎮 Testando o Sistema

### Teste 1: Interface Web

1. Acesse `http://localhost:8081`
2. Selecione uma rota (ex: Rota 1)
3. Clique no botão Play ▶️
4. Observe:
   - ✅ Animação no frontend
   - ✅ Toast de confirmação
   - ✅ Robô executando (se conectado)

### Teste 2: API Direta

```bash
# Testar backend
curl http://localhost:8080/api/rotas

# Executar rota
curl -X POST http://localhost:8080/api/rotas/1/executar

# Status ESP8266
curl http://localhost:8080/api/esp8266/status
```

### Teste 3: ESP8266 Direto

```bash
# Substituir pelo IP do seu ESP8266
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"ROTA_1"}'
```

---

## 🔧 Configurações Importantes

### Backend: `application.properties`

```properties
# Porta do servidor
server.port=8080

# IP do ESP8266 (ALTERAR!)
esp8266.host=192.168.1.XXX
esp8266.port=80

# Modo dev (true = funciona sem ESP8266)
esp8266.dev.mode=false
```

### Frontend: Porta

Se precisar mudar a porta do frontend, edite `vite.config.ts`:

```typescript
server: {
  port: 8081  // Altere aqui
}
```

### Firmware: WiFi

Edite no arquivo `.ino`:

```cpp
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";
```

---

## 🐛 Problemas Comuns

### ❌ Backend não inicia

**Erro:** `Port 8080 already in use`

**Solução:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### ❌ Frontend não carrega

**Erro:** `EADDRINUSE: address already in use`

**Solução:** Mude a porta em `vite.config.ts` ou mate o processo:
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### ❌ ESP8266 não conecta WiFi

**Possíveis causas:**
- SSID ou senha incorretos
- Rede 5GHz (ESP8266 só suporta 2.4GHz)
- Roteador bloqueando novos dispositivos

**Solução:**
1. Verifique credenciais
2. Use rede 2.4GHz
3. Verifique configurações do roteador

### ❌ Backend não envia comandos ao ESP8266

**Erro no console:** `ESP8266 não conectada`

**Solução:**
1. Verifique se o IP está correto
2. Teste manualmente:
   ```bash
   curl http://192.168.1.XXX/status
   ```
3. Verifique se estão na mesma rede
4. Desative firewall temporariamente

### ❌ Robô não se move

**Possíveis causas:**
- Baterias descarregadas
- Motores desconectados
- Motor Shield mal encaixado

**Solução:**
1. Verifique carga das baterias
2. Teste conexões dos motores
3. Reencaixe o Motor Shield

---

## 📊 Checklist de Funcionamento

Use este checklist para validar o sistema:

### Backend
- [ ] Compila sem erros
- [ ] Inicia na porta 8080
- [ ] API `/api/rotas` retorna 7 rotas
- [ ] Endpoint `/api/esp8266/status` responde

### Frontend
- [ ] Compila sem erros
- [ ] Inicia na porta 8081
- [ ] Mostra grafo com 7 nós
- [ ] Lista 7 rotas
- [ ] Animação funciona ao clicar Play

### ESP8266
- [ ] Conecta ao WiFi
- [ ] Mostra IP no Serial Monitor
- [ ] Página web acessível no navegador
- [ ] Endpoint `/status` responde
- [ ] Recebe comandos via POST `/executar`

### Hardware
- [ ] Motor Shield encaixado corretamente
- [ ] Motores conectados
- [ ] Baterias carregadas
- [ ] Motores giram ao enviar comandos

### Integração
- [ ] Frontend → Backend funciona
- [ ] Backend → ESP8266 funciona
- [ ] ESP8266 → Motores funciona
- [ ] Sistema completo end-to-end funciona

---

## 🎯 Próximos Passos

Depois que tudo estiver funcionando:

1. **Calibração**
   - Ajuste velocidade dos motores
   - Calibre ângulos das curvas
   - Teste distâncias reais

2. **Otimização**
   - Ajuste tempos das rotas
   - Melhore precisão das curvas
   - Otimize consumo de bateria

3. **Testes**
   - Execute todas as 7 rotas
   - Teste parada de emergência
   - Valide precisão das distâncias

4. **Documentação**
   - Registre ajustes realizados
   - Documente problemas encontrados
   - Anote melhorias implementadas

---

## 📚 Documentação Completa

- **README.md** - Visão geral do projeto
- **firmware/README.md** - Documentação do firmware
- **firmware/TESTES.md** - Guia completo de testes
- **backend/ESP8266_CONFIG.md** - Configuração detalhada
- **CHANGELOG_ESP8266.md** - Histórico de mudanças

---

## 🆘 Suporte

### Logs Úteis

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
# Observe mensagens de erro no console
```

**Frontend:**
```bash
cd frontend
npm run dev
# Abra DevTools (F12) → Console
```

**ESP8266:**
```
Arduino IDE → Tools → Serial Monitor (115200 baud)
# Observe mensagens de debug
```

### Comandos de Debug

```bash
# Testar conectividade ESP8266
ping 192.168.1.XXX

# Testar porta HTTP
curl http://192.168.1.XXX/

# Testar backend
curl http://localhost:8080/api/rotas

# Ver logs do backend
cd backend
./mvnw spring-boot:run --debug
```

---

## 👥 Equipe

- Felipe Bergamin Dantas - 103538
- Rafael Alves Oliveira - 76601
- Kauã Rodrigues Lessa - 101338
- Cauã Bordin - 71765
- Luís Henrique Lisboa Marques - 77215

**UNIFECAF - Engenharia da Computação - 4º Semestre**  
**ExpoTech 2025**

---

## ✅ Sistema Funcionando?

Se você chegou até aqui e tudo está funcionando:

🎉 **Parabéns!** Seu Robô Entregador Autônomo está pronto!

Agora você pode:
- Demonstrar o projeto
- Fazer ajustes finos
- Adicionar novas funcionalidades
- Documentar melhorias

**Boa sorte na ExpoTech 2025! 🚀**
