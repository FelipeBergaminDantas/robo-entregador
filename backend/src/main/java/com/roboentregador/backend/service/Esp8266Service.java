package com.roboentregador.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class Esp8266Service {
    
    @Value("${esp8266.host:192.168.1.100}")
    private String esp8266Host;
    
    @Value("${esp8266.port:80}")
    private int esp8266Port;
    
    @Value("${esp8266.timeout:5000}")
    private int timeout;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public Esp8266Service() {
        // ✅ CORREÇÃO: Use valor padrão no construtor
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(5000)) // Valor padrão
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Envia um comando para a ESP8266 via HTTP
     */
    public boolean enviarComando(String comando) {
        try {
            String url = String.format("http://%s:%d/executar", esp8266Host, esp8266Port);
            
            // Cria JSON no formato {"comando":"ROTA_1"}
            Map<String, String> jsonBody = new HashMap<>();
            jsonBody.put("comando", comando);
            String jsonString = objectMapper.writeValueAsString(jsonBody);
            
            System.out.println("📡 Enviando para ESP8266: " + url);
            System.out.println("📦 Payload: " + jsonString);
            
            // ✅ CORREÇÃO: Use o timeout injetado aqui
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofMillis(timeout))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonString))
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, 
                    HttpResponse.BodyHandlers.ofString());
            
            boolean sucesso = response.statusCode() == 200;
            
            System.out.println(sucesso ? 
                "✅ Comando enviado com sucesso!" : 
                "❌ Erro HTTP: " + response.statusCode());
            System.out.println("📥 Resposta: " + response.body());
            
            return sucesso;
            
        } catch (IOException | InterruptedException e) {
            System.err.println("❌ Erro de comunicação com ESP8266: " + e.getMessage());
            System.err.println("💡 Verifique:");
            System.err.println("   - ESP está ligado e na rede");
            System.err.println("   - IP correto: " + esp8266Host + ":" + esp8266Port);
            System.err.println("   - WiFi funcionando");
            return false;
        }
    }
    
    /**
     * Verifica se a ESP8266 está conectada
     */
    public boolean verificarConexao() {
        try {
            // Tenta enviar um comando de teste
            return enviarComando("STOP"); // STOP é seguro para teste
        } catch (Exception e) {
            return false;
        }
    }
}
