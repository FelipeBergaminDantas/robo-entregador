package com.roboentregador.backend.repository;

import com.roboentregador.backend.model.*;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Repository para gerenciar as rotas
 * Demonstra ABSTRAÇÃO ao encapsular a lógica de acesso aos dados
 * Em um cenário real, poderia usar JPA/Hibernate com banco de dados
 */
@Repository
public class RotaRepository {
    
    private final Map<Long, Rota> rotas;
    
    /**
     * Construtor que inicializa as rotas disponíveis
     * Demonstra POLIMORFISMO ao armazenar diferentes tipos de Rota
     */
    public RotaRepository() {
        this.rotas = new HashMap<>();
        inicializarRotas();
    }
    
    /**
     * Inicializa todas as rotas concretas
     * Demonstra POLIMORFISMO: todas as rotas são tratadas como tipo Rota
     */
    private void inicializarRotas() {
        Rota rota1 = new Rota1();
        Rota rota2 = new Rota2();
        Rota rota3 = new Rota3();
        Rota rota4 = new Rota4();
        Rota rota5 = new Rota5();
        Rota rota6 = new Rota6();
        Rota rota7 = new Rota7();
        
        rotas.put(rota1.getId(), rota1);
        rotas.put(rota2.getId(), rota2);
        rotas.put(rota3.getId(), rota3);
        rotas.put(rota4.getId(), rota4);
        rotas.put(rota5.getId(), rota5);
        rotas.put(rota6.getId(), rota6);
        rotas.put(rota7.getId(), rota7);
    }
    
    /**
     * Busca todas as rotas disponíveis
     */
    public List<Rota> findAll() {
        return new ArrayList<>(rotas.values());
    }
    
    /**
     * Busca uma rota por ID
     */
    public Optional<Rota> findById(Long id) {
        return Optional.ofNullable(rotas.get(id));
    }
    
    /**
     * Verifica se uma rota existe
     */
    public boolean existsById(Long id) {
        return rotas.containsKey(id);
    }
}
