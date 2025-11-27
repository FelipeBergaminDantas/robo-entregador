@echo off
echo ========================================
echo   Testando API - Grafo Tracer Pro
echo ========================================
echo.

echo [1] Listando todas as rotas...
curl http://localhost:8080/api/rotas
echo.
echo.

echo [2] Detalhes da Rota 1...
curl http://localhost:8080/api/rotas/1
echo.
echo.

echo [3] Executando Rota 1...
curl -X POST http://localhost:8080/api/rotas/1/executar
echo.
echo.

echo [4] Status da ESP8266...
curl http://localhost:8080/api/esp8266/status
echo.
echo.

echo ========================================
echo   Testes concluidos!
echo ========================================
pause
