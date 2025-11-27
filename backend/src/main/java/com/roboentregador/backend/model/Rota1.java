package com.roboentregador.backend.model;

/**
 * Rota 1: A → B → E → G
 * Distância: 49 + 64.5 + 44 = 157.5cm
 * Demonstra HERANÇA (extends Rota) e POLIMORFISMO (implementa executar())
 */
public class Rota1 extends Rota {
    
    public Rota1() {
        super(1L, "Rota 1");
        inicializarRota();
    }
    
    /**
     * Inicializa as instruções específicas desta rota
     */
    private void inicializarRota() {
        // Nós: A → B → E → G
        adicionarNo("A");
        adicionarNo("B");
        adicionarNo("E");
        adicionarNo("G");
        
        // Arestas: AB(49cm) + BE(64.5cm) + EG(44cm)
        adicionarAresta("AB");
        adicionarAresta("BE");
        adicionarAresta("EG");
        
        // Distância total: 157.5cm
        setDistanciaTotal(157.5);
    }
    
    /**
     * Implementação POLIMÓRFICA do método executar()
     * Retorna o comando específico para esta rota
     * A ESP8266 será responsável por interpretar e executar os movimentos
     */
    @Override
    public String executar() {
        return "ROTA_1";
    }
}
