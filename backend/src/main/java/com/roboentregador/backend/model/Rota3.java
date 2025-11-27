package com.roboentregador.backend.model;

/**
 * Rota 3: A → C → F → G
 * Distância: 65 + 61 + 55 = 181cm
 * Demonstra HERANÇA (extends Rota) e POLIMORFISMO (implementa executar())
 */
public class Rota3 extends Rota {
    
    public Rota3() {
        super(3L, "Rota 3");
        inicializarRota();
    }
    
    /**
     * Inicializa as instruções específicas desta rota
     */
    private void inicializarRota() {
        // Percurso: A → C → F → G
        adicionarNo("A");
        adicionarAresta("AC");
        
        adicionarNo("C");
        adicionarAresta("CF");
        
        adicionarNo("F");
        adicionarAresta("FG");
        
        adicionarNo("G");
        
        // Distância total: 65 + 61 + 55 = 181cm
        setDistanciaTotal(181.0);
    }
    
    /**
     * Implementação POLIMÓRFICA do método executar()
     * Retorna o comando específico para esta rota
     * A ESP8266 será responsável por interpretar e executar os movimentos
     */
    @Override
    public String executar() {
        return "ROTA_3";
    }
}
