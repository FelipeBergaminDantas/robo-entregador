package com.roboentregador.backend.model;

/**
 * Rota 6: A → C → D → B → E → G
 * Distância: 65 + 62 + 60 + 64.5 + 44 = 295.5cm
 * Demonstra HERANÇA (extends Rota) e POLIMORFISMO (implementa executar())
 */
public class Rota6 extends Rota {
    
    public Rota6() {
        super(6L, "Rota 6");
        inicializarRota();
    }
    
    /**
     * Inicializa as instruções específicas desta rota
     */
    private void inicializarRota() {
        // Percurso: A → C → D → B → E → G
        adicionarNo("A");
        adicionarAresta("AC");
        
        adicionarNo("C");
        adicionarAresta("CD");
        
        adicionarNo("D");
        adicionarAresta("DB");
        
        adicionarNo("B");
        adicionarAresta("BE");
        
        adicionarNo("E");
        adicionarAresta("EG");
        
        adicionarNo("G");
        
        // Distância total: 65 + 62 + 60 + 64.5 + 44 = 295.5cm
        setDistanciaTotal(295.5);
    }
    
    /**
     * Implementação POLIMÓRFICA do método executar()
     * Retorna o comando específico para esta rota
     * A ESP8266 será responsável por interpretar e executar os movimentos
     */
    @Override
    public String executar() {
        return "ROTA_6";
    }
}
