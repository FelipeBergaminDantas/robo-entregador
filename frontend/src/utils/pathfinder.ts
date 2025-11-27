import { Edge, Route, Node } from "@/types/graph";

export class PathFinder {
  private adjacencyList: Map<string, Array<{ node: string; weight: number }>>;
  private nodes: Map<string, { x: number; y: number }>;
  private readonly AVERAGE_SPEED_KMH = 60; // velocidade média em km/h
  private readonly CURVE_TIME_PENALTY = 0.5; // penalidade de 0.5 minutos por curva

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

  // Calcula o número de curvas no caminho
  private calculateCurveCount(path: string[]): number {
    // Número de curvas = número de nós intermediários (excluindo origem e destino)
    // Por exemplo: A-B-D-E-G tem 3 curvas (em B, D, E)
    if (path.length <= 2) return 0;
    return path.length - 2;
  }

  findAllPaths(start: string, end: string): Route[] {
    const routes: Route[] = [];
    const visited = new Set<string>();
    
    const dfs = (current: string, path: string[], distance: number) => {
      if (current === end) {
        const fullPath = [...path, current];
        const baseTimeInMinutes = (distance / this.AVERAGE_SPEED_KMH) * 60;
        const curveCount = this.calculateCurveCount(fullPath);
        const curvePenalty = curveCount * this.CURVE_TIME_PENALTY;
        const totalTimeInMinutes = baseTimeInMinutes + curvePenalty;
        
        routes.push({
          path: fullPath,
          distance,
          time: Math.round(totalTimeInMinutes * 10) / 10 // Round to 1 decimal place
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
