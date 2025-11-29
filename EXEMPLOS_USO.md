# 💡 Exemplos Práticos de Uso

Guia com exemplos reais de como usar a integração.

---

## 🎮 Uso via Interface Web (Recomendado)

### Passo a Passo

1. **Abra o Frontend**
   ```
   http://localhost:8081
   ```

2. **Selecione uma Rota**
   - Clique em qualquer rota da lista
   - O grafo destaca o caminho

3. **Execute a Rota**
   - Clique no botão **Play ▶️**
   - Observe a animação
   - Aguarde a notificação de sucesso

4. **Parar em Emergência** (se necessário)
   - Use a função `pararRobo()` no console do navegador

---

## 💻 Uso via Código JavaScript

### No Console do Navegador (F12)

```javascript
// Importar funções (se estiver no contexto do app)
import { executarRota1, executarRota7, pararRobo } from './services/api';

// Executar Rota 1 (mais rápida)
const resultado = await executarRota1();
console.log(resultado);
// {
//   sucesso: true,
//   mensagem: "Rota executada com sucesso!",
//   comando: "ROTA_1",
//   caminho: "A → B → E → G",
//   distancia: 157.5,
//   rotaId: 1
// }

// Executar Rota 7 (mais longa)
await executarRota7();

// Parar robô
await pararRobo();
```

### Em um Componente React

```typescript
import { executarRota1, executarRota2 } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

function MeuComponente() {
  const { toast } = useToast();

  const handleExecutar = async (rotaNum: number) => {
    let resultado;
    
    switch(rotaNum) {
      case 1:
        resultado = await executarRota1();
        break;
      case 2:
        resultado = await executarRota2();
        break;
      // ... outras rotas
    }
    
    if (resultado?.sucesso) {
      toast({
        title: "✅ Sucesso!",
        description: resultado.mensagem,
      });
    } else {
      toast({
        title: "❌ Erro",
        description: "Falha ao executar rota",
        variant: "destructive",
      });
    }
  };

  return (
    <button onClick={() => handleExecutar(1)}>
      Executar Rota 1
    </button>
  );
}
```

---

## 🔧 Uso via cURL (Terminal)

### Executar Rotas

```bash
# Rota 1 (mais rápida - 157.5cm)
curl -X POST http://localhost:8080/api/rota1

# Rota 2
curl -X POST http://localhost:8080/api/rota2

# Rota 3
curl -X POST http://localhost:8080/api/rota3

# Rota 4
curl -X POST http://localhost:8080/api/rota4

# Rota 5
curl -X POST http://localhost:8080/api/rota5

# Rota 6
curl -X POST http://localhost:8080/api/rota6

# Rota 7 (mais longa - 336.5cm)
curl -X POST http://localhost:8080/api/rota7

# Parar robô
curl -X POST http://localhost:8080/api/parar
```

### Com Formatação JSON (jq)

```bash
# Instale jq: https://stedolan.github.io/jq/

# Executar e ver resposta formatada
curl -X POST http://localhost:8080/api/rota1 | jq

# Saída:
{
  "sucesso": true,
  "mensagem": "Rota executada com sucesso!",
  "comando": "ROTA_1",
  "caminho": "A → B → E → G",
  "distancia": 157.5,
  "rotaId": 1
}
```

### Salvar Resposta em Arquivo

```bash
curl -X POST http://localhost:8080/api/rota1 > resposta.json
cat resposta.json
```

---

## 🐍 Uso via Python

### Script Simples

```python
import requests
import json

# URL base do backend
BASE_URL = "http://localhost:8080/api"

def executar_rota(numero):
    """Executa uma rota específica"""
    url = f"{BASE_URL}/rota{numero}"
    response = requests.post(url)
    return response.json()

def parar_robo():
    """Para o robô"""
    url = f"{BASE_URL}/parar"
    response = requests.post(url)
    return response.json()

# Executar rota 1
resultado = executar_rota(1)
print(f"✅ {resultado['mensagem']}")
print(f"📍 Caminho: {resultado['caminho']}")
print(f"📏 Distância: {resultado['distancia']}cm")

# Executar todas as rotas em sequência
import time

for i in range(1, 8):
    print(f"\n🚀 Executando Rota {i}...")
    resultado = executar_rota(i)
    
    if resultado['sucesso']:
        print(f"✅ {resultado['caminho']}")
        # Aguardar conclusão (baseado na distância)
        tempo_espera = resultado['distancia'] / 10  # ~10cm/s
        time.sleep(tempo_espera)
    else:
        print(f"❌ Erro: {resultado['mensagem']}")
        break

print("\n🏁 Todas as rotas executadas!")
```

### Script com Tratamento de Erros

```python
import requests
import time

def executar_rota_segura(numero, max_tentativas=3):
    """Executa rota com retry"""
    url = f"http://localhost:8080/api/rota{numero}"
    
    for tentativa in range(max_tentativas):
        try:
            response = requests.post(url, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Tentativa {tentativa + 1} falhou: {e}")
            if tentativa < max_tentativas - 1:
                time.sleep(2)
            else:
                return {"sucesso": False, "mensagem": str(e)}

# Usar
resultado = executar_rota_segura(1)
if resultado['sucesso']:
    print("✅ Sucesso!")
else:
    print(f"❌ Falhou após 3 tentativas: {resultado['mensagem']}")
```

---

## 🌐 Uso via Postman

### Configuração

1. **Criar Nova Request**
   - Method: `POST`
   - URL: `http://localhost:8080/api/rota1`

2. **Headers** (opcional)
   - `Content-Type: application/json`

3. **Enviar**
   - Clique em "Send"
   - Veja a resposta JSON

### Collection Completa

Crie uma collection com todas as rotas:

```json
{
  "info": {
    "name": "Robô Entregador",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Rota 1",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/rota1"
      }
    },
    {
      "name": "Rota 2",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/rota2"
      }
    },
    {
      "name": "Parar",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/parar"
      }
    }
  ]
}
```

---

## 🤖 Automação com Scripts

### Bash Script (Linux/Mac)

```bash
#!/bin/bash

# executar_todas_rotas.sh

echo "🚀 Iniciando execução de todas as rotas..."

for i in {1..7}
do
  echo ""
  echo "📍 Executando Rota $i..."
  
  response=$(curl -s -X POST http://localhost:8080/api/rota$i)
  sucesso=$(echo $response | jq -r '.sucesso')
  caminho=$(echo $response | jq -r '.caminho')
  
  if [ "$sucesso" = "true" ]; then
    echo "✅ $caminho"
    sleep 20  # Aguardar conclusão
  else
    echo "❌ Erro ao executar rota $i"
    exit 1
  fi
done

echo ""
echo "🏁 Todas as rotas executadas com sucesso!"
```

**Uso:**
```bash
chmod +x executar_todas_rotas.sh
./executar_todas_rotas.sh
```

### PowerShell Script (Windows)

```powershell
# executar_todas_rotas.ps1

Write-Host "🚀 Iniciando execução de todas as rotas..." -ForegroundColor Green

for ($i = 1; $i -le 7; $i++) {
    Write-Host ""
    Write-Host "📍 Executando Rota $i..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/rota$i"
    
    if ($response.sucesso) {
        Write-Host "✅ $($response.caminho)" -ForegroundColor Green
        Start-Sleep -Seconds 20
    } else {
        Write-Host "❌ Erro ao executar rota $i" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🏁 Todas as rotas executadas com sucesso!" -ForegroundColor Green
```

**Uso:**
```powershell
.\executar_todas_rotas.ps1
```

---

## 📊 Monitoramento em Tempo Real

### Script Python com Logs

```python
import requests
import time
from datetime import datetime

def log(mensagem):
    """Log com timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {mensagem}")

def executar_com_log(numero):
    """Executa rota com logs detalhados"""
    log(f"🚀 Iniciando Rota {numero}")
    
    inicio = time.time()
    resultado = requests.post(f"http://localhost:8080/api/rota{numero}").json()
    fim = time.time()
    
    tempo_resposta = (fim - inicio) * 1000  # ms
    
    if resultado['sucesso']:
        log(f"✅ Rota {numero} executada")
        log(f"📍 Caminho: {resultado['caminho']}")
        log(f"📏 Distância: {resultado['distancia']}cm")
        log(f"⏱️ Tempo de resposta: {tempo_resposta:.0f}ms")
    else:
        log(f"❌ Erro na Rota {numero}: {resultado['mensagem']}")
    
    return resultado

# Executar com monitoramento
for i in range(1, 8):
    executar_com_log(i)
    time.sleep(2)
    print("-" * 50)
```

---

## 🎯 Casos de Uso Práticos

### 1. Demonstração Sequencial

Execute todas as rotas em ordem:

```bash
for i in {1..7}; do 
  curl -X POST http://localhost:8080/api/rota$i
  sleep 20
done
```

### 2. Teste de Stress

Execute a mesma rota múltiplas vezes:

```bash
for i in {1..10}; do
  echo "Execução $i"
  curl -X POST http://localhost:8080/api/rota1
  sleep 16  # Tempo da rota 1
done
```

### 3. Comparação de Rotas

Execute e compare tempos:

```python
import requests
import time

rotas = []

for i in range(1, 8):
    inicio = time.time()
    requests.post(f"http://localhost:8080/api/rota{i}")
    fim = time.time()
    
    tempo = fim - inicio
    rotas.append((i, tempo))
    time.sleep(20)

# Ordenar por tempo
rotas.sort(key=lambda x: x[1])

print("\n📊 Ranking de Rotas (por tempo de resposta):")
for pos, (rota, tempo) in enumerate(rotas, 1):
    print(f"{pos}. Rota {rota}: {tempo:.2f}s")
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
