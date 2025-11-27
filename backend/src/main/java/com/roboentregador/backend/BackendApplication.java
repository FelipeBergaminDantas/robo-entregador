package com.roboentregador.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação Spring Boot
 * Demonstra o pilar de ABSTRAÇÃO ao encapsular toda a configuração do Spring
 */
@SpringBootApplication
public class BackendApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("🚀 Backend Grafo Tracer Pro iniciado na porta 8080");
    }
}
