import { Edge, Route, Node } from "@/types/graph";

export class PathFinder {
  private adjacencyList: Map<string, Array<{ node: string; weight: number }>>;
  private nodes: Map<string, { x: number; y: number }>;
  private readonly AVERAGE_SPEED_KMH = 60; // velocidade média em km/h
  private readonly CURVE_PENALTY_FACTOR = 0.3; // penalidade adicional por curva (30% do tempo base)

  constructor(edges: Edge[], nodes: Node[]) {
    this.adjacencyList = new Map();
    this.nodes = new Map(nodes.map(n => [n.id, { x: n.x, y: n.y }]));
    
    // Build adjacency list
    edges.forEach(edge => {
      if (!this.adjacencyList.has(edge.source)) {
        this.adjacencyList.set(edge.source, []);
      }
      if (!this.adjacencyList.has(edge.target)) {
        this.adjacencyList.set(edge.target, []);
      }
      
      this.adjacencyList.get(edge.source)!.push({
        node: edge.target,
        weight: edge.weight
      });
      
      // For undirected graph
      this.adjacencyList.get(edge.target)!.push({
        node: edge.source,
        weight: edge.weight
      });
    });
  }

  // Calcula o ângulo entre dois vetores (em graus)
  private calculateAngle(p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }): number {
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    const cosAngle = dot / (mag1 * mag2);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    const angleDeg = (angleRad * 180) / Math.PI;
    
    return angleDeg;
  }

  // Calcula penalidade de tempo baseada em curvas
  private calculateCurvePenalty(path: string[]): number {
    if (path.length < 3) return 0; // Sem curvas para menos de 3 nós
    
    let totalPenalty = 0;
    
    for (let i = 0; i < path.length - 2; i++) {
      const p1 = this.nodes.get(path[i]);
      const p2 = this.nodes.get(path[i + 1]);
      const p3 = this.nodes.get(path[i + 2]);
      
      if (p1 && p2 && p3) {
        const angle = this.calculateAngle(p1, p2, p3);
        // Quanto menor o ângulo (curva mais fechada), maior a penalidade
        // Ângulo de 180° = reto (sem penalidade), ângulo de 0° = curva de 180° (máxima penalidade)
        const curveSeverity = (180 - angle) / 180; // 0 = reto, 1 = curva de 180°
        totalPenalty += curveSeverity * this.CURVE_PENALTY_FACTOR;
      }
    }
    
    return totalPenalty;
  }

  findAllPaths(start: string, end: string): Route[] {
    const routes: Route[] = [];
    const visited = new Set<string>();
    
    const dfs = (current: string, path: string[], distance: number) => {
      if (current === end) {
        const fullPath = [...path, current];
        const baseTimeInMinutes = (distance / this.AVERAGE_SPEED_KMH) * 60;
        const curvePenalty = this.calculateCurvePenalty(fullPath);
        const totalTimeInMinutes = baseTimeInMinutes * (1 + curvePenalty);
        
        routes.push({
          path: fullPath,
          distance,
          time: Math.round(totalTimeInMinutes)
        });
        return;
      }
      
      visited.add(current);
      const neighbors = this.adjacencyList.get(current) || [];
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          dfs(neighbor.node, [...path, current], distance + neighbor.weight);
        }
      }
      
      visited.delete(current);
    };
    
    dfs(start, [], 0);
    
    // Sort routes by time (considering curves)
    return routes.sort((a, b) => a.time - b.time);
  }
}
