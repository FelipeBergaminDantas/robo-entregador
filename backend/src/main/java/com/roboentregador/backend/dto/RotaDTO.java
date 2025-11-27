package com.roboentregador.backend.dto;

import com.roboentregador.backend.model.Instrucao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para transferência de dados de Rota
 * Demonstra ENCAPSULAMENTO ao separar a representação de dados da lógica de negócio
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RotaDTO {
    private Long id;
    private String nome;
    private double distanciaTotal; // em centímetros
    private String unidade = "cm";
    private int tempoEstimado;
    private List<String> nosPercorridos;
    private List<String> arestasPercorridas;
    private List<Instrucao> instrucoes;
}
