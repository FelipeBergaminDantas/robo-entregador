package com.roboentregador.backend.model;

/**
 * Rota 5: A → B → D → C → F → G
 * Distância: 49 + 60 + 62 + 61 + 55 = 287cm
 * Demonstra HERANÇA (extends Rota) e POLIMORFISMO (implementa executar())
 */
public class Rota5 extends Rota {
    
    public Rota5() {
        super(5L, "Rota 5");
        inicializarRota();
    }
    
    /**
     * Inicializa as instruções específicas desta rota
     */
    private void inicializarRota() {
        // Percurso: A → B → D → C → F → G
        adicionarNo("A");
        adicionarAresta("AB");
        
        adicionarNo("B");
        adicionarAresta("BD");
        
        adicionarNo("D");
        adicionarAresta("DC");
        
        adicionarNo("C");
        adicionarAresta("CF");
        
        adicionarNo("F");
        adicionarAresta("FG");
        
        adicionarNo("G");
        
        // Distância total: 49 + 60 + 62 + 61 + 55 = 287cm
        setDistanciaTotal(287.0);
    }
    
    /**
     * Implementação POLIMÓRFICA do método executar()
     * Retorna o comando específico para esta rota
     * A ESP8266 será responsável por interpretar e executar os movimentos
     */
    @Override
    public String executar() {
        return "ROTA_5";
    }
}
