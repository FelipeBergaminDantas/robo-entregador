package com.roboentregador.backend.model;

/**
 * Rota 7: A → B → E → D → C → F → G
 * Distância: 49 + 64.5 + 45 + 62 + 61 + 55 = 336.5cm
 * Rota mais longa
 * Demonstra HERANÇA (extends Rota) e POLIMORFISMO (implementa executar())
 */
public class Rota7 extends Rota {
    
    public Rota7() {
        super(7L, "Rota 7");
        inicializarRota();
    }
    
    /**
     * Inicializa as instruções específicas desta rota
     */
    private void inicializarRota() {
        // Percurso: A → B → E → D → C → F → G
        adicionarNo("A");
        adicionarAresta("AB");
        
        adicionarNo("B");
        adicionarAresta("BE");
        
        adicionarNo("E");
        adicionarAresta("ED");
        
        adicionarNo("D");
        adicionarAresta("DC");
        
        adicionarNo("C");
        adicionarAresta("CF");
        
        adicionarNo("F");
        adicionarAresta("FG");
        
        adicionarNo("G");
        
        // Distância total: 49 + 64.5 + 45 + 62 + 61 + 55 = 336.5cm
        setDistanciaTotal(336.5);
    }
    
    /**
     * Implementação POLIMÓRFICA do método executar()
     * Retorna o comando específico para esta rota
     * A ESP8266 será responsável por interpretar e executar os movimentos
     */
    @Override
    public String executar() {
        return "ROTA_7";
    }
}
