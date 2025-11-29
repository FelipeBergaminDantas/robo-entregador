@echo off
echo ========================================
echo   Robo Entregador - Backend
echo ========================================
echo.

set JAVA_HOME=C:\Users\rafa_\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.17.10-hotspot
set MAVEN_HOME=C:\Program Files\apache-maven-3.9.6\
set PATH=%JAVA_HOME%\bin;%PATH%

echo Iniciando servidor Spring Boot...
echo Backend rodara em: http://localhost:8080
echo.

mvnw.cmd spring-boot:run
