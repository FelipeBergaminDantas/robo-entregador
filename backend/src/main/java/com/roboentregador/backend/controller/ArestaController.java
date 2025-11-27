package com.roboentregador.backend.controller;

import com.roboentregador.backend.model.Aresta;
import com.roboentregador.backend.repository.ArestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para gerenciamento de arestas do grafo
 */
@RestController
@RequestMapping("/api/arestas")
@CrossOrigin(origins = "*")
public class ArestaController {
    
    private final ArestaRepository arestaRepository;
    
    @Autowired
    public ArestaController(ArestaRepository arestaRepository) {
        this.arestaRepository = arestaRepository;
    }
    
    /**
     * GET /api/arestas
     * Lista todas as arestas do grafo
     */
    @GetMapping
    public ResponseEntity<List<Aresta>> listarArestas() {
        List<Aresta> arestas = arestaRepository.findAll();
        return ResponseEntity.ok(arestas);
    }
    
    /**
     * GET /api/arestas/{id}
     * Busca uma aresta específica (ex: "AB")
     */
    @GetMapping("/{id}")
    public ResponseEntity<Aresta> buscarArestaPorId(@PathVariable String id) {
        return arestaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
