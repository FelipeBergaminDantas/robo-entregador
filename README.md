# 🤖 Robô Entregador Autônomo com Rotas Otimizadas

Sistema inteligente de otimização de rotas para entregas autônomas, desenvolvido como projeto integrador do curso de Engenharia da Computação da UNIFECAF.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## 📋 Sobre o Projeto

O **Robô Entregador Autônomo** é um sistema completo que integra hardware (ESP8266 com firmware em C++) e software (backend Java + frontend React) para realizar entregas autônomas seguindo rotas otimizadas. O sistema calcula e visualiza diferentes caminhos em um grafo, permitindo escolher a rota mais eficiente baseada em critérios como distância e tempo.

### 🎯 Objetivos

O projeto possui como principal objetivo desenvolver um robô capaz de executar entregas autonomamente, seguindo rotas otimizadas e integrando diferentes áreas da computação e engenharia.

**Objetivos específicos:**
- Demonstrar aplicação prática dos 4 pilares da Programação Orientada a Objetos
- Implementar algoritmos de grafos e otimização de rotas
- Integrar hardware e software usando comunicação serial/Wi-Fi
- Simular e visualizar o percurso do robô em tempo real
- Aplicar princípios de Física e Eletrônica na construção do robô
- Utilizar conceitos de Pesquisa Operacional para minimizar distância e tempo

## 🏗️ Arquitetura do Sistema

```
┌───────────────────────────────┐
│        Frontend (React)       │
│  Visualização, D3.js, UI/UX   │
└──────────────▲────────────────┘
               │ HTTP/REST
┌──────────────┴────────────────┐
│     Backend (Spring Boot)     │
│  POO, Rotas, Algoritmos, API  │
└──────────────▲────────────────┘
               │ WiFi
┌──────────────┴────────────────┐
│        ESP8266 (C++)          │
│ Motores | Sensores | Firmware │
└───────────────────────────────┘
```

### Componentes Principais

#### 🎨 Frontend (React + TypeScript)
- **Visualização interativa** do grafo com D3.js
- **Interface responsiva** com Tailwind CSS e shadcn/ui
- **Animação em tempo real** do percurso do robô
- **Mapa de calor** para visualização de rotas (verde → amarelo → vermelho)
- **Notificações** de início e fim de execução

#### ⚙️ Backend (Java + Spring Boot)
- **API REST** para gerenciamento de rotas
- **Arquitetura MVC** completa
- **7 rotas pré-configuradas** com diferentes caminhos
- **Cálculo automático** de tempo e distância
- **Comunicação** com ESP8266 via Interface WEB

#### 🔌 Hardware/Firmware (ESP8266 + C++)
- **Controle de motores** via Motor Shield para NodeMCU ESP8266 V2
- **Receber comandos** via Interface WEB
- **Comunicação** WiFi com backend
- **Enviar feedback** ao backend

## 📚 Integração com Disciplinas

### 1️⃣ Object Oriented Programming (POO)

O projeto demonstra todos os **4 pilares da POO**:

#### 🔹 Abstração
```java
public abstract class Rota {
    public abstract String executar();
}
```
Classe abstrata `Rota` define o contrato que todas as rotas devem seguir.

#### 🔹 Encapsulamento
```java
private Long id;
private String nome;
private List<Instrucao> instrucoes;

public Long getId() { return id; }
```
Atributos privados com acesso controlado via getters/setters.

#### 🔹 Herança
```java
public class Rota1 extends Rota {
    // Implementação específica
}
```
7 classes concretas herdam de `Rota` abstrata.

#### 🔹 Polimorfismo
```java
@Override
public String executar() {
    return "ROTA_1"; // Cada rota executa diferente
}
```
Método `executar()` implementado de forma única em cada classe.

**Padrões de Projeto Utilizados:**
- **MVC** (Model-View-Controller)
- **DTO** (Data Transfer Object)
- **Repository Pattern**
- **Dependency Injection**

### 2️⃣ Data Structure Strategy and Implementation

#### Estrutura de Grafos
- **Grafo direcionado** com 7 nós (A, B, C, D, E, F, G)
- **9 arestas** com pesos (distâncias em centímetros)
- **Representação** via lista de adjacências

#### Estruturas de Dados Utilizadas
- **ArrayList**: Armazenamento de nós e arestas
- **HashMap**: Mapeamento de rotas por ID
- **Set**: Controle de elementos únicos (nós ativos)

#### Algoritmos
- **Busca de caminhos** em grafos
- **Ordenação** de rotas por distância
- **Cálculo de tempo** baseado em distância

### 3️⃣ Eletrônica Digital e Analógica

O ESP8266 é o microcontrolador central do sistema, responsável por interpretar os comandos enviados pelo backend e transformá-los eações físisicas no carrinho.

#### Hardware ESP8266
- **Microcontrolador 32 bits dual-core**: permite processar comandos do caminho, cálculos e leitura de sensores simultaneamente
- **WiFi**: garantem comunicação entre o carrinho e o backend
- **GPIOs**: usados para enviar sinais digitais para o driver dos motores

#### Componentes Eletrônicos
- **Motores DC**: realizam a movimentação do carrinho
- **Driver de Motor (Motor Shield para NodeMCU ESP8266 V2)**: recebe sinais do ESP8266 e fornece corrente suficiente aos motores
- **Sensores analógicos e digitais**: permitem detectar obstáculos e seguir caminhos
- **Fonte Regulada (Baterias de Lítio)**: garante alimentação estável para ESP8266 e motores

#### Relação com Circuitos Digitais
- As GPIOs trabalham como níveis lógicos (0 e 1) — equivalentes às saídas de portas lógicas
- A escolha do sentido do motor (frente/trás) funciona como um circuito decodificador, que interpreta combinações de bits para definir a ação do motor
- O driver L298N usa portas lógicas internas para interpretar sinais do ESP8266 e acionar os motores corretamente
- Os sensores funcionam produzindo sinais digitais ou analógicos que o ESP8266 interpreta usando comparações lógicas

### 4️⃣ Operations Research (Pesquisa Operacional)

#### Otimização de Rotas
O grafo possui **7 nós** e **9 arestas**.

O sistema implementa conceitos de **otimização** para:
- **Minimizar tempo** de percurso
- **Minimizar distância** percorrida (custo)
- **Reduzir custos** operacionais (energia, desgaste)
- **Comparar rotas** alternativas

**Modelo matemático:**
```
Min Z = Σ (distância das arestas)
```

#### Métricas Calculadas
```
Rota 1: 157.5cm → 15.8s  (mais rápida)
Rota 2: 198cm   → 19.8s
Rota 3: 181cm   → 18.1s
Rota 4: 216cm   → 21.6s
Rota 5: 287cm   → 28.7s
Rota 6: 295.5cm → 29.6s
Rota 7: 336.5cm → 33.7s  (mais longa)
```

#### Análise de Eficiência
- **Ordenação** automática por eficiência (distância/tempo)
- **Visualização** com mapa de calor (verde → amarelo → vermelho)
- **Comparação** de múltiplas rotas
- **Seleção** da rota ótima
- Rotas ordenadas por eficiência

### 5️⃣ Física para Sistemas Computacionais

O funcionamento do carrinho robotizado que segue o caminho definido no grafo envolve diretamente três áreas fundamentais da física: **Eletrostática**, **Mecânica** e **Termodinâmica**.

#### Eletrostática
A eletrostática aparece principalmente na forma de comportamento das cargas elétricas dentro dos circuitos do ESP8266 e dos componentes:
- As tensões (diferenças de potencial) que circulam nos GPIOs são baseadas em princípios eletrostáticos
- O driver de motor opera interpretando níveis de tensão (0V e 3.3V), que representam "0" e "1" lógicos
- Acúmulos de carga e ruídos eletrostáticos podem interferir na leitura dos sensores, exigindo bom aterramento e reguladores

#### Mecânica
A mecânica é essencial para o movimento do carrinho:
- Os motores DC transformam energia elétrica em energia mecânica, produzindo torque no eixo
- O movimento linear do carrinho depende da segunda lei de Newton (F = m·a), pois mais torque gera maior aceleração
- O atrito com o solo, massa do carrinho e distribuição de peso influenciam diretamente a estabilidade e precisão das curvas
- **Velocidade constante**: 10 cm/s
- **Tempo = Distância / Velocidade**

#### Termodinâmica
A termodinâmica está presente na dissipação de calor dos componentes:
- Motores DC e drivers como o L298N aquecem devido à conversão de energia elétrica em trabalho mecânico e perdas resistivas
- O ESP8266 também gera calor interno durante o processamento
- É necessário prever ventilação adequada ou dissipação térmica para evitar sobreaquecimento e garantir operação eficiente

## 🚀 Rotas Disponíveis

| Rota | Caminho | Distância | Tempo | Arestas |
|------|---------|-----------|-------|---------|
| 1 | A → B → E → G | 157.5 cm | 15.8s | AB, BE, EG |
| 2 | A → B → D → E → G | 198 cm | 19.8s | AB, BD, DE, EG |
| 3 | A → C → F → G | 181 cm | 18.1s | AC, CF, FG |
| 4 | A → C → D → E → G | 216 cm | 21.6s | AC, CD, DE, EG |
| 5 | A → B → D → C → F → G | 287 cm | 28.7s | AB, BD, DC, CF, FG |
| 6 | A → C → D → B → E → G | 295.5 cm | 29.6s | AC, CD, DB, BE, EG |
| 7 | A → B → E → D → C → F → G | 336.5 cm | 33.7s | AB, BE, ED, DC, CF, FG |

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Maven** (gerenciamento de dependências)
- **Lombok** (redução de boilerplate)

### Frontend
- **React 18**
- **TypeScript 5**
- **Vite** (build tool)
- **D3.js** (visualização de grafos)
- **Tailwind CSS** (estilização)
- **shadcn/ui** (componentes)

### Hardware/Firmware
- **ESP8266** (microcontrolador)
- **C++** (Arduino Framework)
- **Driver de motor** (Motor Shield para NodeMCU ESP8266 V2)
- **Sensores** analógicos e digitais
- **Arduino IDE** / **PlatformIO**
- **Servidor HTTP** integrado (porta 80)
- **7 rotas pré-programadas** com movimentos otimizados

## 📁 Estrutura do Projeto

```
robo-entregador/
├── backend/                    # Backend Java Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/          # Código Java
│   │       └── resources/     # Configurações
│   ├── ESP8266_CONFIG.md      # Guia de configuração
│   └── pom.xml               # Dependências Maven
│
├── frontend/                  # Frontend React TypeScript
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── services/         # API calls
│   │   └── types/            # TypeScript types
│   └── package.json          # Dependências NPM
│
├── firmware/                  # Firmware ESP8266 ⭐ NOVO
│   ├── robo_entregador_esp8266.ino  # Código principal
│   ├── README.md             # Documentação completa
│   ├── TESTES.md             # Guia de testes
│   └── config_example.h      # Exemplo de configuração
│
├── README.md                  # Este arquivo
└── CHANGELOG_ESP8266.md      # Histórico de mudanças
```

## 📦 Como Executar

> 💡 **Guia Rápido:** Para instruções passo a passo, veja [`QUICK_START.md`](QUICK_START.md)

### Pré-requisitos
- Java 17+
- Node.js 18+
- Maven
- ESP8266 configurado

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Servidor rodando em: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Interface disponível em: `http://localhost:8081`

### ESP8266 (Firmware)
```bash
# 1. Configure WiFi no arquivo firmware/robo_entregador_esp8266.ino
# Edite as linhas:
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

# 2. Abra no Arduino IDE
# 3. Selecione: Tools → Board → NodeMCU 1.0 (ESP-12E Module)
# 4. Faça upload (→)
# 5. Abra Serial Monitor (115200 baud)
# 6. Anote o IP exibido
# 7. Configure o IP no backend/src/main/resources/application.properties
```

Documentação completa: [`firmware/README.md`](firmware/README.md)

## 📊 Funcionalidades

✅ **Visualização interativa** do grafo com D3.js  
✅ **7 rotas otimizadas** pré-configuradas  
✅ **Animação em tempo real** do percurso  
✅ **Mapa de calor** (verde → amarelo → vermelho)  
✅ **Execução automática** ao clicar em "Play"  
✅ **Notificações** de início e fim  
✅ **Integração** com ESP8266  
✅ **API REST** completa  
✅ **Cálculo automático** de tempo e distância  

## 👥 Equipe de Desenvolvimento

- **Felipe Bergamin Dantas** - 103538
- **Rafael Alves Oliveira** - 76601
- **Kauã Rodrigues Lessa** - 101338
- **Cauã Bordin** - 71765
- **Luís Henrique Lisboa Marques** - 77215

## 🎓 Instituição

**UNIFECAF - Centro Universitário UNIFECAF**  
Curso: Engenharia da Computação - 4º Semestre  
Projeto Integrador - ExpoTech 2025


## 🎯 Conclusão

O projeto integrou diversas áreas da Engenharia da Computação, criando um sistema completo capaz de calcular, simular e executar rotas otimizadas por meio de um robô autônomo.

Foram aplicados conceitos fundamentais de POO, algoritmos em grafos, eletrônica, física e pesquisa operacional, demonstrando interdisciplinaridade e capacidade técnica.

O resultado final é um sistema funcional, modular, escalável e totalmente alinhado às exigências acadêmicas do Projeto Integrador.

---

