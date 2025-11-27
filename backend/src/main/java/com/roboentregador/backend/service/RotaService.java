package com.roboentregador.backend.service;

import com.roboentregador.backend.dto.ExecucaoResponseDTO;
import com.roboentregador.backend.dto.RotaDTO;
import com.roboentregador.backend.dto.RotaResumoDTO;
import com.roboentregador.backend.model.Rota;
import com.roboentregador.backend.repository.RotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Serviço de negócio para gerenciamento de rotas
 * Demonstra:
 * - ABSTRAÇÃO: Encapsula a lógica de negócio
 * - ENCAPSULAMENTO: Separa a lógica da apresentação
 * - Injeção de Dependência com @Autowired
 */
@Service
public class RotaService {
    
    private final RotaRepository rotaRepository;
    private final Esp8266Service esp8266Service;
    
    /**
     * Construtor com injeção de dependência
     * Demonstra o princípio de Inversão de Dependência (SOLID)
     */
    @Autowired
    public RotaService(RotaRepository rotaRepository, Esp8266Service esp8266Service) {
        this.rotaRepository = rotaRepository;
        this.esp8266Service = esp8266Service;
    }
    
    /**
     * Lista todas as rotas disponíveis (resumo)
     */
    public List<RotaResumoDTO> listarRotasResumo() {
        return rotaRepository.findAll().stream()
                .map(this::converterParaResumoDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca detalhes completos de uma rota
     */
    public Optional<RotaDTO> buscarRotaPorId(Long id) {
        return rotaRepository.findById(id)
                .map(this::converterParaDTO);
    }
    
    /**
     * Executa uma rota específica
     * Demonstra POLIMORFISMO: chama o método executar() que é implementado
     * de forma diferente em cada classe concreta
     */
    public ExecucaoResponseDTO executarRota(Long id) {
        Optional<Rota> rotaOpt = rotaRepository.findById(id);
        
        if (rotaOpt.isEmpty()) {
            return new ExecucaoResponseDTO(
                    false,
                    "Rota não encontrada",
                    null,
                    id,
                    null
            );
        }
        
        Rota rota = rotaOpt.get();
        
        // Aqui ocorre o POLIMORFISMO: cada rota executa de forma diferente
        String comando = rota.executar();
        
        // Envia o comando para a ESP8266
        boolean sucesso = esp8266Service.enviarComando(comando);
        
        return new ExecucaoResponseDTO(
                sucesso,
                sucesso ? "Rota executada com sucesso!" : "Erro ao enviar comando para ESP8266",
                comando,
                rota.getId(),
                rota.getNome()
        );
    }
    
    /**
     * Converte Rota para RotaDTO
     */
    private RotaDTO converterParaDTO(Rota rota) {
        return new RotaDTO(
                rota.getId(),
                rota.getNome(),
                rota.getDistanciaTotal(),
                "cm",
                rota.calcularTempoTotal(),
                rota.getNosPercorridos(),
                rota.getArestasPercorridas(),
                rota.getInstrucoes()
        );
    }
    
    /**
     * Converte Rota para RotaResumoDTO
     */
    private RotaResumoDTO converterParaResumoDTO(Rota rota) {
        return new RotaResumoDTO(
                rota.getId(),
                rota.getNome(),
                rota.getDistanciaTotal(),
                "cm",
                rota.calcularTempoTotal(),
                rota.getNosPercorridos().size(),
                rota.getNosPercorridos(),
                rota.getArestasPercorridas()
        );
    }
}
