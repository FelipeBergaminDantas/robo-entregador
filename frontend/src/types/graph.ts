export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
  label?: string;
}

export interface Route {
  id: number;
  nome: string;
  path: string[];
  distance: number;
  distanciaTotal: number;
  unidade: string;
  tempoEstimado: number;
  nosPercorridos: string[];
  arestasPercorridas: string[];
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}
