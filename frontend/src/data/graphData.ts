import { GraphData } from "@/types/graph";

// Graph representation with real distances in centimeters
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
    { source: "A", target: "B", weight: 49, label: "49cm" },    // AB - 49cm
    { source: "A", target: "C", weight: 65, label: "65cm" },    // AC - 65cm
    { source: "B", target: "D", weight: 60, label: "60cm" },    // BD - 60cm
    { source: "C", target: "D", weight: 62, label: "62cm" },    // CD - 62cm
    { source: "C", target: "F", weight: 61, label: "61cm" },    // CF - 61cm
    { source: "B", target: "E", weight: 64.5, label: "64,5cm" }, // BE - 64.5cm
    { source: "D", target: "E", weight: 45, label: "45cm" },    // DE - 45cm
    { source: "F", target: "G", weight: 55, label: "55cm" },    // FG - 55cm
    { source: "E", target: "G", weight: 44, label: "44cm" },    // EG - 44cm
  ],
};

// Animation configuration
export const ANIMATION_CONFIG = {
  defaultDuration: 10, // seconds
  minDuration: 3,
  maxDuration: 30,
};
