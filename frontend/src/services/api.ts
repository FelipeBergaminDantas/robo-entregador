import { Route } from "@/types/graph";

const API_BASE_URL = "http://localhost:8080/api";

export interface Aresta {
  origem: string;
  destino: string;
  distancia: number;
  id: string;
}

export interface ExecucaoResponse {
  sucesso: boolean;
  mensagem: string;
  comandoEnviado: string;
  rotaId: number;
  nomeRota: string;
}

/**
 * Busca todas as rotas disponíveis
 */
export async function fetchRotas(): Promise<Route[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rotas`);
    if (!response.ok) {
      throw new Error("Erro ao buscar rotas");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar rotas:", error);
    return [];
  }
}

/**
 * Busca detalhes de uma rota específica
 */
export async function fetchRotaDetalhes(id: number): Promise<Route | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/rotas/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes da rota");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da rota:", error);
    return null;
  }
}

/**
 * Executa uma rota
 */
export async function executarRota(id: number): Promise<ExecucaoResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/rotas/${id}/executar`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota:", error);
    return null;
  }
}

/**
 * Busca todas as arestas do grafo
 */
export async function fetchArestas(): Promise<Aresta[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/arestas`);
    if (!response.ok) {
      throw new Error("Erro ao buscar arestas");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar arestas:", error);
    return [];
  }
}

/**
 * ========================================
 * FUNÇÕES DIRETAS PARA ROTAS (ESP8266)
 * ========================================
 */

export interface RotaDiretaResponse {
  sucesso: boolean;
  mensagem: string;
  comando: string;
  caminho: string;
  distancia: number;
  rotaId: number;
}

/**
 * Executa ROTA 1: A → B → E → G (157.5cm)
 */
export async function executarRota1(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("🚀 Chamando /api/rota1");
    const response = await fetch(`${API_BASE_URL}/rota1`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota 1");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota 1:", error);
    return null;
  }
}

/**
 * Executa ROTA 2: A → B → D → E → G (198cm)
 */
export async function executarRota2(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("🚀 Chamando /api/rota2");
    const response = await fetch(`${API_BASE_URL}/rota2`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota 2");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota 2:", error);
    return null;
  }
}

/**
 * Executa ROTA 3: A → C → F → G (181cm)
 */
export async function executarRota3(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("🚀 Chamando /api/rota3");
    const response = await fetch(`${API_BASE_URL}/rota3`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota 3");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota 3:", error);
    return null;
  }
}

/**
 * Executa ROTA 4: A → C → D → E → G (216cm)
 */
export async function executarRota4(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("🚀 Chamando /api/rota4");
    const response = await fetch(`${API_BASE_URL}/rota4`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota 4");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota 4:", error);
    return null;
  }
}

/**
 * Executa ROTA 5: A → B → D → C → F → G (287cm)
 */
export async function executarRota5(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("🚀 Chamando /api/rota5");
    const response = await fetch(`${API_BASE_URL}/rota5`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota 5");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota 5:", error);
    return null;
  }
}

/**
 * Executa ROTA 6: A → C → D → B → E → G (295.5cm)
 */
export async function executarRota6(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("🚀 Chamando /api/rota6");
    const response = await fetch(`${API_BASE_URL}/rota6`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota 6");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota 6:", error);
    return null;
  }
}

/**
 * Executa ROTA 7: A → B → E → D → C → F → G (336.5cm)
 */
export async function executarRota7(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("🚀 Chamando /api/rota7");
    const response = await fetch(`${API_BASE_URL}/rota7`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao executar rota 7");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao executar rota 7:", error);
    return null;
  }
}

/**
 * Para o robô (comando STOP)
 */
export async function pararRobo(): Promise<RotaDiretaResponse | null> {
  try {
    console.log("⏹️ Chamando /api/parar");
    const response = await fetch(`${API_BASE_URL}/parar`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error("Erro ao parar robô");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao parar robô:", error);
    return null;
  }
}
