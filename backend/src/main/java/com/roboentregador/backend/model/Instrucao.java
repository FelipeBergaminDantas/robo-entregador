package com.roboentregador.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa uma instrução individual de movimento
 * Demonstra ENCAPSULAMENTO com atributos privados e getters/setters
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Instrucao {
    private String direcao; // "FRENTE", "ESQUERDA", "DIREITA", "TRAS"
    private int distancia; // em centímetros
    private int duracao; // em milissegundos
    
    @Override
    public String toString() {
        return String.format("%s(%dcm, %dms)", direcao, distancia, duracao);
    }
}
