package com.roboentregador.backend.controller;

import com.roboentregador.backend.service.Esp8266Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller para gerenciar a comunicação com a ESP8266
 */
@RestController
@RequestMapping("/api/esp8266")
@CrossOrigin(origins = "*")
public class Esp8266Controller {
    
    private final Esp8266Service esp8266Service;
    
    @Autowired
    public Esp8266Controller(Esp8266Service esp8266Service) {
        this.esp8266Service = esp8266Service;
    }
    
    /**
     * GET /api/esp8266/status
     * Verifica se a ESP8266 está conectada
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> verificarStatus() {
        boolean conectada = esp8266Service.verificarConexao();
        
        Map<String, Object> response = new HashMap<>();
        response.put("conectada", conectada);
        response.put("mensagem", conectada ? 
                "ESP8266 conectada e pronta" : 
                "ESP8266 não conectada (modo simulação)");
        
        return ResponseEntity.ok(response);
    }
}
