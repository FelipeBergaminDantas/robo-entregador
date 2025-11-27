package com.roboentregador.backend.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Classe ABSTRATA que representa uma rota genérica
 * Demonstra os pilares:
 * - ABSTRAÇÃO: Define o contrato que todas as rotas devem seguir
 * - ENCAPSULAMENTO: Atributos privados com acesso controlado
 * - HERANÇA: Será estendida por rotas concretas
 * - POLIMORFISMO: Método abstrato executar() será implementado de forma diferente
 */
public abstract class Rota {
    private Long id;
    private String nome;
    private List<Instrucao> instrucoes;
    private double distanciaTotal; // em centímetros
    private List<String> nosPercorridos;
    private List<String> arestasPercorridas; // IDs das arestas (ex: "AB", "BE")
    
    /**
     * Construtor protegido para ser usado pelas classes filhas
     */
    protected Rota(Long id, String nome) {
        this.id = id;
        this.nome = nome;
        this.instrucoes = new ArrayList<>();
        this.nosPercorridos = new ArrayList<>();
        this.arestasPercorridas = new ArrayList<>();
        this.distanciaTotal = 0.0;
    }
    
    /**
     * Método ABSTRATO que define o contrato para execução
     * Cada rota concreta implementará sua própria lógica (POLIMORFISMO)
     * @return Comando a ser enviado para a ESP8266
     */
    public abstract String executar();
    
    /**
     * Método para adicionar uma instrução à rota
     * Demonstra ENCAPSULAMENTO ao controlar como as instruções são adicionadas
     */
    protected void adicionarInstrucao(String direcao, int distancia, int duracao) {
        Instrucao instrucao = new Instrucao(direcao, distancia, duracao);
        this.instrucoes.add(instrucao);
        this.distanciaTotal += distancia; // distância em centímetros
    }
    
    /**
     * Adiciona um nó ao percurso
     */
    protected void adicionarNo(String no) {
        this.nosPercorridos.add(no);
    }
    
    /**
     * Adiciona uma aresta ao percurso
     */
    protected void adicionarAresta(String arestaId) {
        this.arestasPercorridas.add(arestaId);
    }
    
    /**
     * Define a distância total da rota
     */
    protected void setDistanciaTotal(double distancia) {
        this.distanciaTotal = distancia;
    }
    
    /**
     * Calcula o tempo total estimado da rota em milissegundos
     * Assume velocidade de 10cm/s
     */
    public int calcularTempoTotal() {
        // Se tem instruções com duração, usa elas
        int tempoInstrucoes = instrucoes.stream()
                .mapToInt(Instrucao::getDuracao)
                .sum();
        
        if (tempoInstrucoes > 0) {
            return tempoInstrucoes;
        }
        
        // Caso contrário, calcula baseado na distância
        // Velocidade: 10cm/s = 100ms por cm
        return (int) (distanciaTotal * 100);
    }
    
    // Getters (ENCAPSULAMENTO)
    public Long getId() {
        return id;
    }
    
    public String getNome() {
        return nome;
    }
    
    public List<Instrucao> getInstrucoes() {
        return new ArrayList<>(instrucoes); // Retorna cópia para proteger a lista original
    }
    
    public double getDistanciaTotal() {
        return distanciaTotal;
    }
    
    public List<String> getNosPercorridos() {
        return new ArrayList<>(nosPercorridos); // Retorna cópia para proteger a lista original
    }
    
    public List<String> getArestasPercorridas() {
        return new ArrayList<>(arestasPercorridas);
    }
    
    @Override
    public String toString() {
        return String.format("Rota{id=%d, nome='%s', distancia=%.1fcm, nos=%s}", 
                id, nome, distanciaTotal, nosPercorridos);
    }
}
