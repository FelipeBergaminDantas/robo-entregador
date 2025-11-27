@echo off
echo ========================================
echo   Robo Entregador - Backend
echo ========================================
echo.

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo Iniciando servidor Spring Boot...
echo Backend rodara em: http://localhost:8080
echo.

mvnw.cmd spring-boot:run
