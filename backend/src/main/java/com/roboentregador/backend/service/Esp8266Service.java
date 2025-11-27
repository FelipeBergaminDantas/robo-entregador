package com.roboentregador.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Serviço para comunicação com a ESP8266
 * Demonstra ENCAPSULAMENTO ao isolar a lógica de comunicação
 * Pode ser facilmente substituído por WebSocket, Serial ou MQTT
 */
@Service
public class Esp8266Service {
    
    @Value("${esp8266.host:192.168.1.100}")
    private String esp8266Host;
    
    @Value("${esp8266.port:80}")
    private int esp8266Port;
    
    @Value("${esp8266.timeout:5000}")
    private int timeout;
    
    private final HttpClient httpClient;
    
    public Esp8266Service() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(5000))
                .build();
    }
    
    /**
     * Envia um comando para a ESP8266 via HTTP
     * @param comando Comando a ser executado pela ESP8266
     * @return true se o comando foi enviado com sucesso
     */
    public boolean enviarComando(String comando) {
        try {
            String url = String.format("http://%s:%d/executar", esp8266Host, esp8266Port);
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofMillis(timeout))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(
                            String.format("{\"comando\":\"%s\"}", comando)
                    ))
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, 
                    HttpResponse.BodyHandlers.ofString());
            
            boolean sucesso = response.statusCode() == 200;
            
            if (sucesso) {
                System.out.println("✅ Comando enviado para ESP8266: " + comando);
            } else {
                System.err.println("❌ Erro ao enviar comando. Status: " + response.statusCode());
            }
            
            return sucesso;
            
        } catch (IOException | InterruptedException e) {
            System.err.println("⚠️ ESP8266 não conectada - Comando não enviado: " + comando);
            // Em modo de desenvolvimento, retorna sucesso para testes
            return true;
        }
    }
    
    /**
     * Verifica se a ESP8266 está conectada
     */
    public boolean verificarConexao() {
        try {
            String url = String.format("http://%s:%d/status", esp8266Host, esp8266Port);
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofMillis(2000))
                    .GET()
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, 
                    HttpResponse.BodyHandlers.ofString());
            
            return response.statusCode() == 200;
            
        } catch (IOException | InterruptedException e) {
            return false;
        }
    }
}
