package com.roboentregador.backend.controller;

import com.roboentregador.backend.dto.ExecucaoResponseDTO;
import com.roboentregador.backend.dto.RotaDTO;
import com.roboentregador.backend.dto.RotaResumoDTO;
import com.roboentregador.backend.service.RotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller REST para gerenciamento de rotas
 * Demonstra o padrão MVC (Model-View-Controller)
 * Camada de apresentação que recebe requisições HTTP
 */
@RestController
@RequestMapping("/api/rotas")
@CrossOrigin(origins = "*") // Permite requisições do frontend
public class RotaController {
    
    private final RotaService rotaService;
    
    /**
     * Injeção de dependência via construtor
     */
    @Autowired
    public RotaController(RotaService rotaService) {
        this.rotaService = rotaService;
    }
    
    /**
     * GET /api/rotas
     * Lista todas as rotas disponíveis (resumo)
     */
    @GetMapping
    public ResponseEntity<List<RotaResumoDTO>> listarRotas() {
        List<RotaResumoDTO> rotas = rotaService.listarRotasResumo();
        return ResponseEntity.ok(rotas);
    }
    
    /**
     * GET /api/rotas/{id}
     * Busca detalhes completos de uma rota específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<RotaDTO> buscarRotaPorId(@PathVariable Long id) {
        Optional<RotaDTO> rota = rotaService.buscarRotaPorId(id);
        
        return rota.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * POST /api/rotas/{id}/executar
     * Executa uma rota específica
     * Demonstra POLIMORFISMO: cada rota executa de forma diferente
     */
    @PostMapping("/{id}/executar")
    public ResponseEntity<ExecucaoResponseDTO> executarRota(@PathVariable Long id) {
        ExecucaoResponseDTO response = rotaService.executarRota(id);
        
        if (response.isSucesso()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
