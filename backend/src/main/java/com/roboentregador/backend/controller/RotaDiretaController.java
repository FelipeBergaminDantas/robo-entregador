package com.roboentregador.backend.controller;

import com.roboentregador.backend.service.Esp8266Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RotaDiretaController {
    
    private final Esp8266Service esp8266Service;
    
    @Autowired
    public RotaDiretaController(Esp8266Service esp8266Service) {
        this.esp8266Service = esp8266Service;
    }
    
    @PostMapping("/rota1")
    public ResponseEntity<Map<String, Object>> executarRota1() {
        System.out.println("🚀 Executando ROTA 1 (A → B → E → G)");
        boolean sucesso = esp8266Service.enviarComando("ROTA_1");
        return criarResposta(sucesso, "ROTA_1", "A → B → E → G", 157.5, 1);
    }
    
    @PostMapping("/rota2")
    public ResponseEntity<Map<String, Object>> executarRota2() {
        System.out.println("🚀 Executando ROTA 2 (A → B → D → E → G)");
        boolean sucesso = esp8266Service.enviarComando("ROTA_2");
        return criarResposta(sucesso, "ROTA_2", "A → B → D → E → G", 198.0, 2);
    }
    
    @PostMapping("/rota3")
    public ResponseEntity<Map<String, Object>> executarRota3() {
        System.out.println("🚀 Executando ROTA 3 (A → C → F → G)");
        boolean sucesso = esp8266Service.enviarComando("ROTA_3");
        return criarResposta(sucesso, "ROTA_3", "A → C → F → G", 181.0, 3);
    }
    
    @PostMapping("/rota4")
    public ResponseEntity<Map<String, Object>> executarRota4() {
        System.out.println("🚀 Executando ROTA 4 (A → C → D → E → G)");
        boolean sucesso = esp8266Service.enviarComando("ROTA_4");
        return criarResposta(sucesso, "ROTA_4", "A → C → D → E → G", 216.0, 4);
    }
    
    @PostMapping("/rota5")
    public ResponseEntity<Map<String, Object>> executarRota5() {
        System.out.println("🚀 Executando ROTA 5 (A → B → D → C → F → G)");
        boolean sucesso = esp8266Service.enviarComando("ROTA_5");
        return criarResposta(sucesso, "ROTA_5", "A → B → D → C → F → G", 287.0, 5);
    }
    
    @PostMapping("/rota6")
    public ResponseEntity<Map<String, Object>> executarRota6() {
        System.out.println("🚀 Executando ROTA 6 (A → C → D → B → E → G)");
        boolean sucesso = esp8266Service.enviarComando("ROTA_6");
        return criarResposta(sucesso, "ROTA_6", "A → C → D → B → E → G", 295.5, 6);
    }
    
    @PostMapping("/rota7")
    public ResponseEntity<Map<String, Object>> executarRota7() {
        System.out.println("🚀 Executando ROTA 7 (A → B → E → D → C → F → G)");
        boolean sucesso = esp8266Service.enviarComando("ROTA_7");
        return criarResposta(sucesso, "ROTA_7", "A → B → E → D → C → F → G", 336.5, 7);
    }
    
    @PostMapping("/parar")
    public ResponseEntity<Map<String, Object>> pararRobo() {
        System.out.println("⏹️ Enviando comando STOP");
        boolean sucesso = esp8266Service.enviarComando("STOP");
        
        Map<String, Object> response = new HashMap<>();
        response.put("sucesso", sucesso);
        response.put("mensagem", sucesso ? "Robô parado com sucesso" : "Erro ao parar robô");
        response.put("comando", "STOP");
        
        return ResponseEntity.ok(response);
    }
    
    private ResponseEntity<Map<String, Object>> criarResposta(
            boolean sucesso, 
            String comando, 
            String caminho, 
            double distancia,
            int rotaId) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("sucesso", sucesso);
        response.put("mensagem", sucesso ? 
                "Rota executada com sucesso!" : 
                "Erro ao enviar comando para ESP8266");
        response.put("comando", comando);
        response.put("caminho", caminho);
        response.put("distancia", distancia);
        response.put("rotaId", rotaId);
        
        return ResponseEntity.ok(response);
    }
}
