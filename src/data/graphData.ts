import { GraphData } from "@/types/graph";

// Graph representation based on typical road network structure
export const graphData: GraphData = {
  nodes: [
    { id: "A", x: 100, y: 200 },
    { id: "B", x: 250, y: 100 },
    { id: "C", x: 250, y: 300 },
    { id: "D", x: 400, y: 150 },
    { id: "E", x: 400, y: 250 },
    { id: "F", x: 550, y: 100 },
    { id: "G", x: 650, y: 200 },
  ],
  edges: [
    { source: "A", target: "B", weight: 7 },
    { source: "A", target: "C", weight: 9 },
    { source: "B", target: "D", weight: 10 },
    { source: "B", target: "F", weight: 15 },
    { source: "C", target: "D", weight: 11 },
    { source: "C", target: "E", weight: 6 },
    { source: "D", target: "E", weight: 2 },
    { source: "D", target: "F", weight: 6 },
    { source: "E", target: "G", weight: 9 },
    { source: "F", target: "G", weight: 8 },
  ],
};

// Animation configuration
export const ANIMATION_CONFIG = {
  defaultDuration: 10, // seconds
  minDuration: 3,
  maxDuration: 30,
};
