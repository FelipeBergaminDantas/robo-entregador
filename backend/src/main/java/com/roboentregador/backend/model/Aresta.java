package com.roboentregador.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa uma aresta (conexão) entre dois nós do grafo
 * Demonstra ENCAPSULAMENTO com atributos privados
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aresta {
    private String origem;      // Nó de origem (ex: "A")
    private String destino;     // Nó de destino (ex: "B")
    private double distancia;   // Distância em centímetros
    
    /**
     * Retorna o identificador da aresta (ex: "AB")
     */
    public String getId() {
        return origem + destino;
    }
    
    @Override
    public String toString() {
        return String.format("%s→%s (%.1fcm)", origem, destino, distancia);
    }
}
