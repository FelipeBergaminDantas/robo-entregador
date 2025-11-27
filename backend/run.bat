@echo off
echo ========================================
echo   Grafo Tracer Pro - Backend
echo   Java Spring Boot
echo ========================================
echo.

echo Verificando Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado!
    echo Por favor, instale Java 17 ou superior.
    echo Download: https://adoptium.net/
    pause
    exit /b 1
)

echo Java encontrado!
echo.

echo Verificando Maven...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo Maven nao encontrado. Usando Maven Wrapper...
    if exist mvnw.cmd (
        echo.
        echo Iniciando servidor...
        echo.
        call mvnw.cmd spring-boot:run
    ) else (
        echo [ERRO] Maven Wrapper nao encontrado!
        pause
        exit /b 1
    )
) else (
    echo Maven encontrado!
    echo.
    echo Iniciando servidor...
    echo.
    mvn spring-boot:run
)

pause
