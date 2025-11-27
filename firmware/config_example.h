/**
 * Arquivo de Configuração - Exemplo
 * 
 * INSTRUÇÕES:
 * 1. Copie este arquivo e renomeie para "config.h"
 * 2. Preencha suas credenciais WiFi
 * 3. Ajuste os parâmetros conforme necessário
 * 4. Inclua no arquivo .ino: #include "config.h"
 */

#ifndef CONFIG_H
#define CONFIG_H

// ========== CONFIGURAÇÃO WIFI ==========
#define WIFI_SSID "SUA_REDE_WIFI"
#define WIFI_PASSWORD "SUA_SENHA_WIFI"

// ========== CONFIGURAÇÃO DOS MOTORES ==========
// Ajuste estes valores se necessário
#define VELOCIDADE_BASE 10.0        // cm/s - velocidade média do robô
#define TEMPO_CURVA_90 500          // ms - tempo para curva de 90 graus
#define TEMPO_CURVA_120 700         // ms - tempo para curva acentuada

// ========== PINOS DO MOTOR SHIELD ==========
// Não altere a menos que use hardware diferente
#define PIN_MOTOR1A 5   // D1 - Motor Esquerdo Frente
#define PIN_MOTOR1B 4   // D2 - Motor Esquerdo Trás
#define PIN_MOTOR2A 0   // D3 - Motor Direito Frente
#define PIN_MOTOR2B 2   // D4 - Motor Direito Trás

// ========== CONFIGURAÇÃO DO SERVIDOR ==========
#define SERVER_PORT 80              // Porta HTTP
#define SERIAL_BAUD 115200          // Velocidade Serial

// ========== CALIBRAÇÃO ==========
// Ajuste fino para compensar diferenças entre motores
#define FATOR_CORRECAO_ESQUERDO 1.0  // 1.0 = sem correção
#define FATOR_CORRECAO_DIREITO 1.0   // >1.0 = mais rápido, <1.0 = mais lento

// ========== DEBUG ==========
#define DEBUG_SERIAL true           // true = mostra logs detalhados
#define DEBUG_MOVIMENTOS true       // true = mostra cada movimento

#endif
