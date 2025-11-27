# 🧪 Guia de Testes - Firmware ESP8266

Este documento contém testes para validar o funcionamento do robô.

## 📋 Checklist Pré-Testes

- [ ] ESP8266 conectado ao computador via USB
- [ ] Motor Shield corretamente encaixado
- [ ] Motores conectados ao Motor Shield
- [ ] Baterias carregadas e conectadas
- [ ] Arduino IDE instalado com suporte ESP8266
- [ ] Código compilado sem erros
- [ ] Serial Monitor aberto (115200 baud)

---

## 🔌 Teste 1: Conexão WiFi

### Objetivo
Verificar se o ESP8266 conecta à rede WiFi.

### Passos
1. Faça upload do código
2. Abra o Serial Monitor
3. Aguarde a mensagem de conexão

### Resultado Esperado
```
Conectando ao WiFi: SUA_REDE
.....
✅ WiFi conectado!
📡 IP do ESP8266: 192.168.1.XXX
```

### Troubleshooting
- ❌ Não conecta: Verifique SSID e senha
- ❌ Timeout: Certifique-se que é rede 2.4GHz
- ❌ IP não aparece: Reinicie o ESP8266

---

## 🌐 Teste 2: Servidor HTTP

### Objetivo
Verificar se o servidor web está respondendo.

### Passos
1. Anote o IP do ESP8266
2. Abra o navegador
3. Acesse `http://192.168.1.XXX` (substitua pelo IP)

### Resultado Esperado
Página HTML com:
- Título "Robô Entregador Autônomo"
- Status atual
- Lista das 7 rotas
- Instruções de uso

### Troubleshooting
- ❌ Página não carrega: Verifique se está na mesma rede
- ❌ Timeout: Verifique firewall
- ❌ Erro 404: Servidor não iniciou corretamente

---

## 🎮 Teste 3: Motores Individuais

### Objetivo
Testar cada motor separadamente.

### Teste 3.1: Motor Esquerdo Frente
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_MOTOR_1A"}'
```

**Esperado:** Motor esquerdo gira para frente por 2 segundos

### Teste 3.2: Motor Direito Frente
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_MOTOR_2A"}'
```

**Esperado:** Motor direito gira para frente por 2 segundos

### Teste 3.3: Ambos os Motores
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_FRENTE"}'
```

**Esperado:** Robô move para frente por 2 segundos

---

## 🧭 Teste 4: Movimentos Básicos

### Teste 4.1: Frente
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_FRENTE"}'
```

**Esperado:** Robô move para frente em linha reta

### Teste 4.2: Ré
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_RE"}'
```

**Esperado:** Robô move para trás em linha reta

### Teste 4.3: Direita
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_DIREITA"}'
```

**Esperado:** Robô gira ~90° para direita

### Teste 4.4: Esquerda
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_ESQUERDA"}'
```

**Esperado:** Robô gira ~90° para esquerda

---

## 🗺️ Teste 5: Rotas Completas

### Teste 5.1: ROTA_1 (Mais Curta)
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"ROTA_1"}'
```

**Esperado:**
- Duração: ~15.8 segundos
- Movimentos: 5 comandos
- Caminho: A → B → E → G

**Verificar:**
- [ ] Robô inicia movimento
- [ ] Executa todas as curvas
- [ ] Para no final
- [ ] Serial mostra "ROTA FINALIZADA"

### Teste 5.2: ROTA_7 (Mais Longa)
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"ROTA_7"}'
```

**Esperado:**
- Duração: ~33.7 segundos
- Movimentos: 11 comandos
- Caminho: A → B → E → D → C → F → G

---

## ⏹️ Teste 6: Parada de Emergência

### Objetivo
Testar comando STOP durante execução.

### Passos
1. Inicie uma rota longa (ROTA_7)
2. Após 5 segundos, envie comando STOP:

```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"STOP"}'
```

**Esperado:**
- Robô para imediatamente
- Serial mostra "PARADA MANUAL"
- Motores desligados

---

## 📊 Teste 7: Status da API

### Objetivo
Verificar endpoint de status.

### Teste 7.1: Status Parado
```bash
curl http://192.168.1.XXX/status
```

**Esperado:**
```json
{
  "status": "parado",
  "conectado": true
}
```

### Teste 7.2: Status Executando
1. Inicie uma rota
2. Durante a execução, consulte status:

```bash
curl http://192.168.1.XXX/status
```

**Esperado:**
```json
{
  "status": "executando",
  "conectado": true
}
```

---

## 🔧 Teste 8: Calibração de Distância

### Objetivo
Verificar se as distâncias estão corretas.

### Preparação
1. Marque uma linha de partida no chão
2. Meça e marque 50cm à frente

### Teste
```bash
# Comando customizado: Frente por 5 segundos (50cm a 10cm/s)
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_50CM"}'
```

### Medição
- Meça a distância real percorrida
- Compare com os 50cm esperados

### Ajustes
Se a distância for diferente:

**Robô percorreu MAIS que 50cm:**
- Velocidade real > 10cm/s
- Reduza os tempos nas rotas proporcionalmente

**Robô percorreu MENOS que 50cm:**
- Velocidade real < 10cm/s
- Aumente os tempos nas rotas proporcionalmente

**Fórmula de correção:**
```
Novo Tempo = Tempo Atual × (Distância Esperada / Distância Real)
```

---

## 🔄 Teste 9: Calibração de Curvas

### Objetivo
Verificar se as curvas são de 90°.

### Preparação
1. Posicione o robô em uma linha reta
2. Marque a direção inicial

### Teste Direita
```bash
curl -X POST http://192.168.1.XXX/executar \
  -H "Content-Type: application/json" \
  -d '{"comando":"TEST_DIREITA"}'
```

### Medição
- Verifique se o robô girou exatamente 90°
- Use um transferidor ou esquadro

### Ajustes
No código, ajuste `TEMPO_CURVA_90`:

```cpp
// Se girou MENOS que 90°
#define TEMPO_CURVA_90 600  // Aumentar tempo

// Se girou MAIS que 90°
#define TEMPO_CURVA_90 400  // Reduzir tempo
```

---

## 🔍 Teste 10: Integração com Backend

### Objetivo
Testar comunicação completa Backend → ESP8266.

### Preparação
1. Backend rodando em `http://localhost:8080`
2. Frontend rodando em `http://localhost:8081`
3. ESP8266 conectado e com IP configurado no `application.properties`

### Teste via Interface Web
1. Acesse o frontend
2. Selecione uma rota
3. Clique no botão Play ▶️

**Esperado:**
- ✅ Animação inicia no frontend
- ✅ Toast de confirmação aparece
- ✅ ESP8266 recebe comando (verificar Serial)
- ✅ Robô executa a rota
- ✅ Rota finaliza corretamente

### Teste via API Backend
```bash
curl -X POST http://localhost:8080/api/rotas/1/executar
```

**Esperado:**
```json
{
  "sucesso": true,
  "mensagem": "Rota executada com sucesso!",
  "comando": "ROTA_1",
  "rotaId": 1,
  "nomeRota": "Rota 1"
}
```

---

## 📝 Registro de Testes

Use esta tabela para registrar seus resultados:

| Teste | Data | Resultado | Observações |
|-------|------|-----------|-------------|
| 1. WiFi | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 2. HTTP | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 3. Motores | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 4. Movimentos | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 5. Rotas | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 6. STOP | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 7. Status | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 8. Distância | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 9. Curvas | ___/___/___ | ⬜ Pass ⬜ Fail | |
| 10. Integração | ___/___/___ | ⬜ Pass ⬜ Fail | |

---

## 🐛 Problemas Comuns

### Robô não anda reto
**Causa:** Motores com velocidades diferentes  
**Solução:** Ajuste `FATOR_CORRECAO_ESQUERDO` ou `FATOR_CORRECAO_DIREITO`

### Curvas imprecisas
**Causa:** Tempo de curva incorreto  
**Solução:** Ajuste `TEMPO_CURVA_90` e `TEMPO_CURVA_120`

### Distâncias erradas
**Causa:** Velocidade real diferente de 10cm/s  
**Solução:** Recalcule todos os tempos proporcionalmente

### Robô para no meio da rota
**Causa:** Bateria fraca ou comando interrompido  
**Solução:** Recarregue baterias, verifique Serial Monitor

### Backend não envia comandos
**Causa:** IP incorreto ou ESP8266 não acessível  
**Solução:** Verifique IP no `application.properties`, teste com `curl`

---

## ✅ Critérios de Aceitação

O sistema está pronto quando:

- ✅ ESP8266 conecta ao WiFi consistentemente
- ✅ Servidor HTTP responde em todas as rotas
- ✅ Todos os motores funcionam corretamente
- ✅ Movimentos básicos (frente, ré, curvas) funcionam
- ✅ Todas as 7 rotas executam completamente
- ✅ Comando STOP funciona imediatamente
- ✅ Distâncias têm precisão de ±10%
- ✅ Curvas têm precisão de ±15°
- ✅ Integração com backend funciona
- ✅ Frontend exibe animações corretamente

---

## 👥 Equipe

- Felipe Bergamin Dantas - 103538
- Rafael Alves Oliveira - 76601
- Kauã Rodrigues Lessa - 101338
- Cauã Bordin - 71765
- Luís Henrique Lisboa Marques - 77215

**UNIFECAF - Engenharia da Computação - 4º Semestre**  
**ExpoTech 2025**
