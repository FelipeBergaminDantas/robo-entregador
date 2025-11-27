# 📐 Diagramas do Sistema

Documentação visual da arquitetura e funcionamento do robô.

## 🏗️ Arquitetura Completa

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO (Navegador)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (React + TypeScript)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Visualização│  │  Seleção de  │  │  Animação    │     │
│  │  do Grafo    │  │  Rotas       │  │  em Tempo    │     │
│  │  (D3.js)     │  │              │  │  Real        │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Java + Spring Boot)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │  Services    │  │  Models      │     │
│  │ (REST API)   │  │  (Lógica)    │  │  (POO)       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │         Esp8266Service (HTTP Client)             │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           ESP8266 (Firmware C++ / Arduino)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ WiFi Server  │  │  Parser de   │  │  Executor de │     │
│  │ (Porta 80)   │  │  Comandos    │  │  Rotas       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │ GPIO (Sinais Digitais)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          MOTOR SHIELD (Driver de Motores)                   │
│  ┌──────────────┐                    ┌──────────────┐      │
│  │   Motor A    │                    │   Motor B    │      │
│  │  (Esquerdo)  │                    │  (Direito)   │      │
│  └──────────────┘                    └──────────────┘      │
└────────────────────────┬────────────────────┬───────────────┘
                         │                    │
                         ▼                    ▼
                    ┌─────────┐          ┌─────────┐
                    │ Motor DC│          │ Motor DC│
                    │ Esquerdo│          │ Direito │
                    └─────────┘          └─────────┘
                         │                    │
                         └────────┬───────────┘
                                  ▼
                          ┌───────────────┐
                          │  MOVIMENTO    │
                          │   DO ROBÔ     │
                          └───────────────┘
```

---

## 🔄 Fluxo de Execução de Rota

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO SELECIONA ROTA NO FRONTEND                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND ENVIA POST /api/rotas/{id}/executar            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND PROCESSA REQUISIÇÃO                             │
│    - RotaController recebe                                  │
│    - RotaService busca rota                                 │
│    - Rota.executar() retorna comando (ex: "ROTA_1")        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. BACKEND ENVIA COMANDO AO ESP8266                        │
│    POST http://192.168.1.XXX/executar                      │
│    Body: {"comando":"ROTA_1"}                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. ESP8266 RECEBE E PROCESSA                               │
│    - handleExecutar() parseia JSON                          │
│    - Identifica ROTA_1                                      │
│    - Carrega array de comandos                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. ESP8266 EXECUTA COMANDOS SEQUENCIALMENTE                │
│    Comando 1: {0, 4900}  → Frente 4.9s                     │
│    Comando 2: {2, 500}   → Direita 0.5s                    │
│    Comando 3: {0, 6450}  → Frente 6.45s                    │
│    Comando 4: {3, 500}   → Esquerda 0.5s                   │
│    Comando 5: {0, 4400}  → Frente 4.4s                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. MOTORES EXECUTAM MOVIMENTOS                             │
│    - Motor Shield recebe sinais GPIO                        │
│    - Motores DC giram conforme direção                      │
│    - Robô percorre caminho A → B → E → G                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. ROTA FINALIZADA                                         │
│    - ESP8266 para motores                                   │
│    - Retorna status 200 OK                                  │
│    - Backend recebe confirmação                             │
│    - Frontend exibe notificação                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Grafo de Rotas

```
                    Nó A (Início)
                        │
            ┌───────────┴───────────┐
            │                       │
         49cm                     65cm
            │                       │
            ▼                       ▼
         Nó B                    Nó C
            │                       │
      ┌─────┼─────┐           ┌─────┼─────┐
      │     │     │           │     │     │
    60cm  64.5cm 60cm       62cm  61cm  62cm
      │     │     │           │     │     │
      ▼     ▼     ▼           ▼     ▼     ▼
    Nó D  Nó E  Nó D       Nó D  Nó F  Nó D
      │     │                       │
    45cm  44cm                    55cm
      │     │                       │
      ▼     ▼                       ▼
    Nó E  Nó G (Fim)             Nó G (Fim)
      │
    44cm
      │
      ▼
   Nó G (Fim)

Legenda:
- Nós: A, B, C, D, E, F, G
- Arestas: Distâncias em centímetros
- A = Início, G = Destino
```

---

## 🎮 Comandos de Movimento

```
┌─────────────────────────────────────────────────────────────┐
│                    COMANDOS DISPONÍVEIS                     │
└─────────────────────────────────────────────────────────────┘

┌──────────┬──────────────┬─────────────────────────────────┐
│ Código   │ Direção      │ Ação dos Motores                │
├──────────┼──────────────┼─────────────────────────────────┤
│    0     │   FRENTE     │  Esquerdo: ↑   Direito: ↑       │
│          │      ↑       │  Ambos giram para frente        │
├──────────┼──────────────┼─────────────────────────────────┤
│    1     │     RÉ       │  Esquerdo: ↓   Direito: ↓       │
│          │      ↓       │  Ambos giram para trás          │
├──────────┼──────────────┼─────────────────────────────────┤
│    2     │  DIREITA     │  Esquerdo: ↑   Direito: ⊗       │
│          │      →       │  Esquerdo gira, Direito para    │
├──────────┼──────────────┼─────────────────────────────────┤
│    3     │  ESQUERDA    │  Esquerdo: ⊗   Direito: ↑       │
│          │      ←       │  Esquerdo para, Direito gira    │
├──────────┼──────────────┼─────────────────────────────────┤
│    4     │   PARAR      │  Esquerdo: ⊗   Direito: ⊗       │
│          │      ⊗       │  Ambos param                    │
└──────────┴──────────────┴─────────────────────────────────┘

Legenda:
↑ = Gira para frente
↓ = Gira para trás
⊗ = Parado
```

---

## 🔌 Diagrama de Conexões

```
┌─────────────────────────────────────────────────────────────┐
│                    NodeMCU ESP8266                          │
│                                                             │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                          │
│  │ D1 │  │ D2 │  │ D3 │  │ D4 │                          │
│  └─┬──┘  └─┬──┘  └─┬──┘  └─┬──┘                          │
└────┼──────┼──────┼──────┼────────────────────────────────┘
     │      │      │      │
     │      │      │      │
┌────┼──────┼──────┼──────┼────────────────────────────────┐
│    │      │      │      │                                 │
│  ┌─▼──┐ ┌─▼──┐ ┌─▼──┐ ┌─▼──┐                            │
│  │M1A │ │M1B │ │M2A │ │M2B │                            │
│  └────┘ └────┘ └────┘ └────┘                            │
│                                                           │
│         Motor Shield para NodeMCU ESP8266 V2             │
│                                                           │
│  ┌──────────────────┐      ┌──────────────────┐         │
│  │   Motor A Out    │      │   Motor B Out    │         │
│  └────────┬─────────┘      └────────┬─────────┘         │
└───────────┼────────────────────────┼───────────────────┘
            │                        │
            │                        │
     ┌──────▼──────┐          ┌──────▼──────┐
     │   Motor DC  │          │   Motor DC  │
     │  (Esquerdo) │          │  (Direito)  │
     └─────────────┘          └─────────────┘
            │                        │
            └────────┬───────────────┘
                     │
              ┌──────▼──────┐
              │   Rodas do  │
              │    Robô     │
              └─────────────┘

Alimentação:
┌─────────────────┐
│ Baterias Lítio  │
│   (7.4V - 9V)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Motor Shield   │
│  (Regulador)    │
└────────┬────────┘
         │
         ├──→ Motores (alimentação)
         └──→ ESP8266 (via regulador 3.3V)
```

---

## 📊 Diagrama de Estados

```
┌─────────────────────────────────────────────────────────────┐
│                   ESTADOS DO SISTEMA                        │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   INICIAL    │
                    │  (Setup)     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  CONECTANDO  │
                    │    WiFi      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  CONECTADO   │
                    │   (Idle)     │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │                         │
              ▼                         ▼
       ┌──────────────┐         ┌──────────────┐
       │  AGUARDANDO  │◄────────│  EXECUTANDO  │
       │   COMANDO    │         │     ROTA     │
       └──────┬───────┘         └──────┬───────┘
              │                        │
              │                        │
              │         ┌──────────────┘
              │         │
              │         ▼
              │  ┌──────────────┐
              └──│   PARADO     │
                 │  (Comando    │
                 │   STOP)      │
                 └──────────────┘

Transições:
- Setup → Conectando: Inicialização
- Conectando → Conectado: WiFi OK
- Conectado → Aguardando: Servidor HTTP pronto
- Aguardando → Executando: Recebe comando ROTA_X
- Executando → Aguardando: Rota finalizada
- Executando → Parado: Comando STOP
- Parado → Aguardando: Pronto para novo comando
```

---

## ⏱️ Timeline de Execução (ROTA_1)

```
Tempo (s)  │ Ação                    │ Comando
───────────┼─────────────────────────┼──────────────────
0.0        │ Início                  │ Recebe ROTA_1
           │                         │
0.0 - 4.9  │ ████████████████████    │ {0, 4900}
           │ Frente (A → B)          │ Frente 4.9s
           │ 49cm                    │
           │                         │
4.9 - 5.4  │ ██                      │ {2, 500}
           │ Curva Direita           │ Direita 0.5s
           │                         │
5.4 - 11.85│ ████████████████████████│ {0, 6450}
           │ Frente (B → E)          │ Frente 6.45s
           │ 64.5cm                  │
           │                         │
11.85-12.35│ ██                      │ {3, 500}
           │ Curva Esquerda          │ Esquerda 0.5s
           │                         │
12.35-16.75│ ████████████████        │ {0, 4400}
           │ Frente (E → G)          │ Frente 4.4s
           │ 44cm                    │
           │                         │
16.75      │ Fim - PARAR             │ Rota finalizada
───────────┴─────────────────────────┴──────────────────

Total: 16.75 segundos
Distância: 157.5 cm
Comandos: 5
```

---

## 🔄 Ciclo de Vida do Comando

```
┌─────────────────────────────────────────────────────────────┐
│ 1. RECEPÇÃO                                                 │
│    - POST /executar recebido                                │
│    - Body parseado: {"comando":"ROTA_1"}                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. VALIDAÇÃO                                                │
│    - Verifica se comando é válido                           │
│    - Verifica se não está executando outra rota            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CARREGAMENTO                                             │
│    - Carrega array de comandos da rota                      │
│    - Inicializa índice = 0                                  │
│    - Define executando = true                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. EXECUÇÃO (Loop)                                          │
│    ┌─────────────────────────────────────────────┐         │
│    │ Para cada comando no array:                 │         │
│    │   - Lê {direção, duração}                   │         │
│    │   - Chama controlar_motores(direção)        │         │
│    │   - Aguarda duração em millis()             │         │
│    │   - Incrementa índice                        │         │
│    └─────────────────────────────────────────────┘         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. FINALIZAÇÃO                                              │
│    - Todos comandos executados                              │
│    - Chama controlar_motores(4) → PARAR                     │
│    - Define executando = false                              │
│    - Retorna status 200 OK                                  │
└─────────────────────────────────────────────────────────────┘
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
