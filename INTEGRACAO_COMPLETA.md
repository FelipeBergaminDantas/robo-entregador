# 🔗 Integração Completa Backend ↔ ESP8266

Documentação completa da integração entre Backend Java, Frontend React e ESP8266.

---

## 📊 Arquitetura da Integração

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                           │
│                localhost:8081                               │
│                                                             │
│  Funções JavaScript:                                        │
│  - executarRota1() até executarRota7()                     │
│  - pararRobo()                                              │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND JAVA (Spring Boot)                     │
│                localhost:8080                               │
│                                                             │
│  Endpoints:                                                 │
│  POST /api/rota1 → RotaDiretaController.executarRota1()   │
│  POST /api/rota2 → RotaDiretaController.executarRota2()   │
│  ...                                                        │
│  POST /api/rota7 → RotaDiretaController.executarRota7()   │
│  POST /api/parar → RotaDiretaController.pararRobo()       │
│                                                             │
│  Service:                                                   │
│  Esp8266Service.enviarComando("ROTA_X")                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                ESP8266 (Firmware C++)                       │
│                192.168.1.XXX:80                            │
│                                                             │
│  Endpoint:                                                  │
│  POST /executar                                             │
│  Body: {"comando":"ROTA_1"}                                │
│                                                             │
│  Handler:                                                   │
│  handleExecutar() → iniciarRota(rota1, tamanho)           │
└────────────────────────┬────────────────────────────────────┘
                         │ GPIO
                         ▼
                    ┌─────────┐
                    │ MOTORES │
                    └─────────┘
```

---

## 🎯 Fluxo Completo de Execução

### Exemplo: Executar Rota 1

```
1. USUÁRIO clica no botão Play da Rota 1 no Frontend
   ↓
2. FRONTEND chama: executarRota1()
   → POST http://localhost:8080/api/rota1
   ↓
3. BACKEND recebe em: RotaDiretaController.executarRota1()
   → Chama: esp8266Service.enviarComando("ROTA_1")
   ↓
4. ESP8266SERVICE envia:
   → POST http://192.168.1.XXX/executar
   → Body: {"comando":"ROTA_1"}
   ↓
5. ESP8266 recebe em: handleExecutar()
   → Parseia JSON
   → Identifica ROTA_1
   → Chama: iniciarRota(rota1, 5)
   ↓
6. ESP8266 executa comandos sequencialmente:
   → {0, 4900}  - Frente 4.9s
   → {2, 500}   - Direita 0.5s
   → {0, 6450}  - Frente 6.45s
   → {3, 500}   - Esquerda 0.5s
   → {0, 4400}  - Frente 4.4s
   ↓
7. MOTORES executam movimentos
   → Robô percorre: A → B → E → G
   ↓
8. ESP8266 finaliza e retorna:
   → Status 200 OK
   → Body: {"status":"ok","rota":"ROTA_1"}
   ↓
9. BACKEND recebe resposta
   → Retorna para Frontend
   ↓
10. FRONTEND exibe notificação:
    → "✅ Rota executada com sucesso!"
```

---

## 📁 Arquivos Criados/Modificados

### Backend Java

#### 1. **RotaDiretaController.java** ⭐ NOVO
**Localização:** `backend/src/main/java/com/roboentregador/backend/controller/`

**Endpoints criados:**
```java
POST /api/rota1  → executarRota1()
POST /api/rota2  → executarRota2()
POST /api/rota3  → executarRota3()
POST /api/rota4  → executarRota4()
POST /api/rota5  → executarRota5()
POST /api/rota6  → executarRota6()
POST /api/rota7  → executarRota7()
POST /api/parar  → pararRobo()
```

**Exemplo de método:**
```java
@PostMapping("/rota1")
public ResponseEntity<Map<String, Object>> executarRota1() {
    System.out.println("🚀 Executando ROTA 1 (A → B → E → G)");
    boolean sucesso = esp8266Service.enviarComando("ROTA_1");
    return criarResposta(sucesso, "ROTA_1", "A → B → E → G", 157.5, 1);
}
```

**Resposta JSON:**
```json
{
  "sucesso": true,
  "mensagem": "Rota executada com sucesso!",
  "comando": "ROTA_1",
  "caminho": "A → B → E → G",
  "distancia": 157.5,
  "rotaId": 1
}
```

#### 2. **Esp8266Service.java** ✏️ MODIFICADO
**Melhorias:**
- Logs mais detalhados
- Exibe URL e payload enviado
- Mostra resposta do ESP8266
- Mensagens de troubleshooting

**Método principal:**
```java
public boolean enviarComando(String comando) {
    String url = String.format("http://%s:%d/executar", esp8266Host, esp8266Port);
    String jsonBody = String.format("{\"comando\":\"%s\"}", comando);
    
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .timeout(Duration.ofMillis(timeout))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
        .build();
    
    HttpResponse<String> response = httpClient.send(request, 
        HttpResponse.BodyHandlers.ofString());
    
    return response.statusCode() == 200;
}
```

---

### Frontend React/TypeScript

#### 3. **api.ts** ✏️ MODIFICADO
**Localização:** `frontend/src/services/api.ts`

**Funções adicionadas:**
```typescript
// 7 funções para executar rotas
executarRota1(): Promise<RotaDiretaResponse | null>
executarRota2(): Promise<RotaDiretaResponse | null>
executarRota3(): Promise<RotaDiretaResponse | null>
executarRota4(): Promise<RotaDiretaResponse | null>
executarRota5(): Promise<RotaDiretaResponse | null>
executarRota6(): Promise<RotaDiretaResponse | null>
executarRota7(): Promise<RotaDiretaResponse | null>

// Função para parar
pararRobo(): Promise<RotaDiretaResponse | null>
```

**Exemplo de uso:**
```typescript
import { executarRota1, pararRobo } from "@/services/api";

// Executar rota 1
const resultado = await executarRota1();
if (resultado?.sucesso) {
  console.log("✅ Rota executada!");
}

// Parar robô
await pararRobo();
```

**Interface de resposta:**
```typescript
interface RotaDiretaResponse {
  sucesso: boolean;
  mensagem: string;
  comando: string;
  caminho: string;
  distancia: number;
  rotaId: number;
}
```

#### 4. **RouteList.tsx** ✏️ MODIFICADO
**Remoções:**
- ❌ Ícone de relógio (Clock)
- ❌ Tooltip com tempo estimado
- ❌ Import do Clock do lucide-react

**Mantido:**
- ✅ Botão Play para executar rota
- ✅ Badge com distância
- ✅ Informações do caminho

---

## 🔧 Configuração Necessária

### 1. Backend (application.properties)

```properties
# IP do ESP8266 (ALTERAR para o IP real!)
esp8266.host=192.168.1.100
esp8266.port=80
esp8266.timeout=5000

# Modo dev (false = envia para ESP8266)
esp8266.dev.mode=false
```

### 2. ESP8266 (Firmware)

O firmware já está configurado para receber comandos em:
```
POST http://192.168.1.XXX/executar
Content-Type: application/json
Body: {"comando":"ROTA_1"}
```

### 3. Rede WiFi

**IMPORTANTE:** Todos os dispositivos devem estar na mesma rede:
- ✅ Computador (Backend + Frontend)
- ✅ ESP8266

---

## 🧪 Como Testar

### Teste 1: Backend → ESP8266 (Direto)

```bash
# Testar rota 1
curl -X POST http://localhost:8080/api/rota1

# Testar rota 7
curl -X POST http://localhost:8080/api/rota7

# Parar robô
curl -X POST http://localhost:8080/api/parar
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "mensagem": "Rota executada com sucesso!",
  "comando": "ROTA_1",
  "caminho": "A → B → E → G",
  "distancia": 157.5,
  "rotaId": 1
}
```

### Teste 2: Frontend → Backend → ESP8266 (Completo)

1. Abra o frontend: `http://localhost:8081`
2. Clique no botão Play de qualquer rota
3. Observe:
   - ✅ Animação no frontend
   - ✅ Toast de confirmação
   - ✅ Logs no console do backend
   - ✅ Robô executando movimento

### Teste 3: Verificar Logs

**Backend (Console):**
```
🚀 Executando ROTA 1 (A → B → E → G)
📡 Enviando para ESP8266: http://192.168.1.100:80/executar
📦 Payload: {"comando":"ROTA_1"}
✅ Comando enviado para ESP8266: ROTA_1
📥 Resposta: {"status":"ok","rota":"ROTA_1"}
```

**ESP8266 (Serial Monitor):**
```
Recebido comando: {"comando":"ROTA_1"}
=== EXECUTANDO ROTA 1 ===
INICIANDO ROTA com 5 comandos
Comando 1/5 - Direcao: 0 Duracao: 4900ms
>>> FRENTE
...
=== ROTA FINALIZADA ===
```

---

## 📋 Checklist de Integração

### Backend
- [ ] `RotaDiretaController.java` criado
- [ ] `Esp8266Service.java` atualizado
- [ ] `application.properties` configurado com IP do ESP8266
- [ ] Backend compilando sem erros
- [ ] Backend rodando em `localhost:8080`

### Frontend
- [ ] `api.ts` atualizado com funções diretas
- [ ] `RouteList.tsx` sem tempo estimado
- [ ] Frontend compilando sem erros
- [ ] Frontend rodando em `localhost:8081`

### ESP8266
- [ ] Firmware carregado
- [ ] Conectado ao WiFi
- [ ] IP anotado e configurado no backend
- [ ] Respondendo em `/executar`

### Rede
- [ ] Todos na mesma rede WiFi
- [ ] Firewall não bloqueando
- [ ] Ping funcionando entre dispositivos

---

## 🐛 Troubleshooting

### ❌ Backend não envia para ESP8266

**Sintoma:** Logs mostram "ESP8266 não conectada"

**Soluções:**
1. Verifique o IP no `application.properties`
2. Teste manualmente:
   ```bash
   curl http://192.168.1.XXX/status
   ```
3. Verifique se estão na mesma rede
4. Desative firewall temporariamente

### ❌ Frontend não chama backend

**Sintoma:** Nada acontece ao clicar Play

**Soluções:**
1. Abra DevTools (F12) → Console
2. Verifique erros de CORS
3. Confirme que backend está rodando
4. Teste endpoint manualmente:
   ```bash
   curl -X POST http://localhost:8080/api/rota1
   ```

### ❌ ESP8266 não responde

**Sintoma:** Timeout ao enviar comando

**Soluções:**
1. Verifique Serial Monitor (115200 baud)
2. Confirme que WiFi está conectado
3. Teste endpoint direto:
   ```bash
   curl -X POST http://192.168.1.XXX/executar \
     -H "Content-Type: application/json" \
     -d '{"comando":"ROTA_1"}'
   ```

---

## 📊 Mapeamento Completo

| Frontend | Backend | ESP8266 | Caminho | Distância |
|----------|---------|---------|---------|-----------|
| `executarRota1()` | `POST /api/rota1` | `ROTA_1` | A→B→E→G | 157.5cm |
| `executarRota2()` | `POST /api/rota2` | `ROTA_2` | A→B→D→E→G | 198cm |
| `executarRota3()` | `POST /api/rota3` | `ROTA_3` | A→C→F→G | 181cm |
| `executarRota4()` | `POST /api/rota4` | `ROTA_4` | A→C→D→E→G | 216cm |
| `executarRota5()` | `POST /api/rota5` | `ROTA_5` | A→B→D→C→F→G | 287cm |
| `executarRota6()` | `POST /api/rota6` | `ROTA_6` | A→C→D→B→E→G | 295.5cm |
| `executarRota7()` | `POST /api/rota7` | `ROTA_7` | A→B→E→D→C→F→G | 336.5cm |
| `pararRobo()` | `POST /api/parar` | `STOP` | - | - |

---

## ✅ Sistema Funcionando

Quando tudo estiver funcionando, você verá:

1. **Frontend:**
   - ✅ Animação da rota
   - ✅ Toast: "✅ Comando Enviado!"

2. **Backend (Console):**
   - ✅ "🚀 Executando ROTA X"
   - ✅ "✅ Comando enviado para ESP8266"

3. **ESP8266 (Serial):**
   - ✅ "=== EXECUTANDO ROTA X ==="
   - ✅ "=== ROTA FINALIZADA ==="

4. **Robô:**
   - ✅ Motores girando
   - ✅ Percorrendo o caminho correto

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

## 🎉 Conclusão

A integração está completa! O sistema agora permite:

✅ Executar qualquer uma das 7 rotas via interface web  
✅ Comunicação automática Backend → ESP8266  
✅ Feedback visual e logs detalhados  
✅ Comando de parada de emergência  
✅ Sistema totalmente funcional end-to-end  

**Boa sorte na ExpoTech 2025! 🚀**
