import { Edge, Route } from "@/types/graph";

export class PathFinder {
  private adjacencyList: Map<string, Array<{ node: string; weight: number }>>;
  private readonly AVERAGE_SPEED_KMH = 60; // velocidade média em km/h

  constructor(edges: Edge[]) {
    this.adjacencyList = new Map();
    
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

  findAllPaths(start: string, end: string): Route[] {
    const routes: Route[] = [];
    const visited = new Set<string>();
    
    const dfs = (current: string, path: string[], distance: number) => {
      if (current === end) {
        const timeInMinutes = (distance / this.AVERAGE_SPEED_KMH) * 60;
        routes.push({
          path: [...path, current],
          distance,
          time: Math.round(timeInMinutes)
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
    
    // Sort routes by distance
    return routes.sort((a, b) => a.distance - b.distance);
  }
}
