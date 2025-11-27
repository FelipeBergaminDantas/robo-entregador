package com.roboentregador.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de execução de rota
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecucaoResponseDTO {
    private boolean sucesso;
    private String mensagem;
    private String comandoEnviado;
    private Long rotaId;
    private String nomeRota;
}
