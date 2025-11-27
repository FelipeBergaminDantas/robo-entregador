package com.roboentregador.backend.model;

/**
 * Rota 4: A → C → D → E → G
 * Distância: 65 + 62 + 45 + 44 = 216cm
 * Demonstra HERANÇA (extends Rota) e POLIMORFISMO (implementa executar())
 */
public class Rota4 extends Rota {
    
    public Rota4() {
        super(4L, "Rota 4");
        inicializarRota();
    }
    
    /**
     * Inicializa as instruções específicas desta rota
     */
    private void inicializarRota() {
        // Percurso: A → C → D → E → G
        adicionarNo("A");
        adicionarAresta("AC");
        
        adicionarNo("C");
        adicionarAresta("CD");
        
        adicionarNo("D");
        adicionarAresta("DE");
        
        adicionarNo("E");
        adicionarAresta("EG");
        
        adicionarNo("G");
        
        // Distância total: 65 + 62 + 45 + 44 = 216cm
        setDistanciaTotal(216.0);
    }
    
    /**
     * Implementação POLIMÓRFICA do método executar()
     * Retorna o comando específico para esta rota
     * A ESP8266 será responsável por interpretar e executar os movimentos
     */
    @Override
    public String executar() {
        return "ROTA_4";
    }
}
