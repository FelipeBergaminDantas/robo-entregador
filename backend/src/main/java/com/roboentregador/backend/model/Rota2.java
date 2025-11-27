package com.roboentregador.backend.model;

/**
 * Rota 2: A → B → D → E → G
 * Distância: 49 + 60 + 45 + 44 = 198cm
 * Demonstra HERANÇA (extends Rota) e POLIMORFISMO (implementa executar())
 */
public class Rota2 extends Rota {
    
    public Rota2() {
        super(2L, "Rota 2");
        inicializarRota();
    }
    
    /**
     * Inicializa as instruções específicas desta rota
     */
    private void inicializarRota() {
        // Percurso: A → B → D → E → G
        adicionarNo("A");
        adicionarAresta("AB");
        
        adicionarNo("B");
        adicionarAresta("BD");
        
        adicionarNo("D");
        adicionarAresta("DE");
        
        adicionarNo("E");
        adicionarAresta("EG");
        
        adicionarNo("G");
        
        // Distância total: 49 + 60 + 45 + 44 = 198cm
        setDistanciaTotal(198.0);
    }
    
    /**
     * Implementação POLIMÓRFICA do método executar()
     * Retorna o comando específico para esta rota
     * A ESP8266 será responsável por interpretar e executar os movimentos
     */
    @Override
    public String executar() {
        return "ROTA_2";
    }
}
