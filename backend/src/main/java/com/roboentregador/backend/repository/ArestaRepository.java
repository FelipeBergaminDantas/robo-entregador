package com.roboentregador.backend.repository;

import com.roboentregador.backend.model.Aresta;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Repository para gerenciar as arestas do grafo
 * Armazena as distâncias entre os nós
 */
@Repository
public class ArestaRepository {
    
    private final Map<String, Aresta> arestas;
    
    public ArestaRepository() {
        this.arestas = new HashMap<>();
        inicializarArestas();
    }
    
    /**
     * Inicializa todas as arestas do grafo com suas distâncias em centímetros
     */
    private void inicializarArestas() {
        adicionarAresta("A", "B", 49.0);    // AB - 49cm
        adicionarAresta("A", "C", 65.0);    // AC - 65cm
        adicionarAresta("B", "D", 60.0);    // BD - 60cm
        adicionarAresta("C", "D", 62.0);    // CD - 62cm
        adicionarAresta("C", "F", 61.0);    // CF - 61cm
        adicionarAresta("B", "E", 64.5);    // BE - 64.5cm
        adicionarAresta("D", "E", 45.0);    // DE - 45cm
        adicionarAresta("F", "G", 55.0);    // FG - 55cm
        adicionarAresta("E", "G", 44.0);    // EG - 44cm
    }
    
    /**
     * Adiciona uma aresta ao repositório
     */
    private void adicionarAresta(String origem, String destino, double distancia) {
        Aresta aresta = new Aresta(origem, destino, distancia);
        arestas.put(aresta.getId(), aresta);
    }
    
    /**
     * Busca uma aresta pelo ID (ex: "AB")
     */
    public Optional<Aresta> findById(String id) {
        return Optional.ofNullable(arestas.get(id));
    }
    
    /**
     * Busca uma aresta por origem e destino
     */
    public Optional<Aresta> findByOrigemDestino(String origem, String destino) {
        return findById(origem + destino);
    }
    
    /**
     * Retorna todas as arestas
     */
    public List<Aresta> findAll() {
        return new ArrayList<>(arestas.values());
    }
    
    /**
     * Calcula a distância total de um caminho
     * @param caminho Lista de nós (ex: ["A", "B", "E", "G"])
     * @return Distância total em centímetros
     */
    public double calcularDistanciaTotal(List<String> caminho) {
        double distanciaTotal = 0.0;
        
        for (int i = 0; i < caminho.size() - 1; i++) {
            String origem = caminho.get(i);
            String destino = caminho.get(i + 1);
            
            Optional<Aresta> aresta = findByOrigemDestino(origem, destino);
            if (aresta.isPresent()) {
                distanciaTotal += aresta.get().getDistancia();
            }
        }
        
        return distanciaTotal;
    }
}
