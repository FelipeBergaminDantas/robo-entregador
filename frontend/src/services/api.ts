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
