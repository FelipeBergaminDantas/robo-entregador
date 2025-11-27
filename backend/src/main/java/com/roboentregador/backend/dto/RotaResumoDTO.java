package com.roboentregador.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO simplificado para listagem de rotas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RotaResumoDTO {
    private Long id;
    private String nome;
    private double distanciaTotal;
    private String unidade = "cm";
    private int tempoEstimado;
    private int numeroDeNos;
    private List<String> nosPercorridos;
    private List<String> arestasPercorridas;
}
