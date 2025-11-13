import { GraphData } from "@/types/graph";

// Graph representation based on typical road network structure
export const graphData: GraphData = {
  nodes: [
    { id: "A", x: 100, y: 250 },
    { id: "B", x: 300, y: 100 },
    { id: "C", x: 300, y: 400 },
    { id: "D", x: 500, y: 250 },
    { id: "E", x: 700, y: 100 },
    { id: "F", x: 700, y: 400 },
    { id: "G", x: 900, y: 250 },
  ],
  edges: [
    { source: "A", target: "B", weight: 2 },
    { source: "A", target: "C", weight: 3 },
    { source: "B", target: "D", weight: 2 },
    { source: "B", target: "E", weight: 4 },
    { source: "C", target: "D", weight: 3 },
    { source: "C", target: "F", weight: 4 },
    { source: "D", target: "E", weight: 2 },
    { source: "E", target: "G", weight: 3 },
    { source: "F", target: "G", weight: 4 },
  ],
};

// Animation configuration
export const ANIMATION_CONFIG = {
  defaultDuration: 10, // seconds
  minDuration: 3,
  maxDuration: 30,
};
