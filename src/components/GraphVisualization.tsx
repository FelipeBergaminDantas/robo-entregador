import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { GraphData, Route } from "@/types/graph";

interface GraphVisualizationProps {
  data: GraphData;
  selectedRoute: Route | null;
  animationProgress: number;
  isAnimating: boolean;
  routeColor?: string;
}

export const GraphVisualization = ({
  data,
  selectedRoute,
  animationProgress,
  isAnimating,
  routeColor = "142 76% 36%", // Default green
}: GraphVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Calculate scale factors
    const xExtent = d3.extent(data.nodes, (d) => d.x) as [number, number];
    const yExtent = d3.extent(data.nodes, (d) => d.y) as [number, number];

    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([0, height]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Determine active elements
    const activeNodes = new Set(selectedRoute?.path || []);
    const activeEdges = new Set<string>();

    if (selectedRoute) {
      for (let i = 0; i < selectedRoute.path.length - 1; i++) {
        const edgeKey1 = `${selectedRoute.path[i]}-${selectedRoute.path[i + 1]}`;
        const edgeKey2 = `${selectedRoute.path[i + 1]}-${selectedRoute.path[i]}`;
        activeEdges.add(edgeKey1);
        activeEdges.add(edgeKey2);
      }
    }

    // Draw edges
    const edges = g
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("x1", (d) => xScale(data.nodes.find((n) => n.id === d.source)!.x))
      .attr("y1", (d) => yScale(data.nodes.find((n) => n.id === d.source)!.y))
      .attr("x2", (d) => xScale(data.nodes.find((n) => n.id === d.target)!.x))
      .attr("y2", (d) => yScale(data.nodes.find((n) => n.id === d.target)!.y))
      .attr("stroke", (d) => {
        const edgeKey = `${d.source}-${d.target}`;
        return activeEdges.has(edgeKey)
          ? `hsl(${routeColor})`
          : "hsl(var(--graph-edge-inactive))";
      })
      .attr("stroke-width", (d) => {
        const edgeKey = `${d.source}-${d.target}`;
        return activeEdges.has(edgeKey) ? 4 : 2;
      })
      .attr("opacity", (d) => {
        const edgeKey = `${d.source}-${d.target}`;
        return activeEdges.has(edgeKey) ? 1 : 0.3;
      })
      .style("transition", "all 0.3s ease");

    // Draw edge labels (weights)
    g.selectAll("text.edge-label")
      .data(data.edges)
      .join("text")
      .attr("class", "edge-label")
      .attr("x", (d) => {
        const source = data.nodes.find((n) => n.id === d.source)!;
        const target = data.nodes.find((n) => n.id === d.target)!;
        return xScale((source.x + target.x) / 2);
      })
      .attr("y", (d) => {
        const source = data.nodes.find((n) => n.id === d.source)!;
        const target = data.nodes.find((n) => n.id === d.target)!;
        return yScale((source.y + target.y) / 2);
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d) => {
        const edgeKey = `${d.source}-${d.target}`;
        return activeEdges.has(edgeKey)
          ? "hsl(var(--foreground))"
          : "hsl(var(--muted-foreground))";
      })
      .attr("font-size", "12px")
      .attr("font-weight", (d) => {
        const edgeKey = `${d.source}-${d.target}`;
        return activeEdges.has(edgeKey) ? "bold" : "normal";
      })
      .style("pointer-events", "none")
      .text((d) => `${d.weight}km`);

    // Draw nodes
    const nodes = g
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => (activeNodes.has(d.id) ? 20 : 15))
      .attr("fill", (d) =>
        activeNodes.has(d.id)
          ? `hsl(${routeColor})`
          : "hsl(var(--graph-node-inactive))"
      )
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 3)
      .attr("opacity", (d) => (activeNodes.has(d.id) ? 1 : 0.4))
      .style("transition", "all 0.3s ease")
      .style("cursor", "pointer");

    // Draw node labels
    g.selectAll("text.node-label")
      .data(data.nodes)
      .join("text")
      .attr("class", "node-label")
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "hsl(var(--background))")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .style("pointer-events", "none")
      .text((d) => d.id);

    // Draw animated "car" if animation is active
    if (isAnimating && selectedRoute && selectedRoute.path.length > 1) {
      const totalSegments = selectedRoute.path.length - 1;
      const segmentProgress = animationProgress * totalSegments;
      const currentSegment = Math.min(
        Math.floor(segmentProgress),
        totalSegments - 1
      );
      const segmentFraction = segmentProgress - currentSegment;

      const fromNode = data.nodes.find(
        (n) => n.id === selectedRoute.path[currentSegment]
      )!;
      const toNode = data.nodes.find(
        (n) => n.id === selectedRoute.path[currentSegment + 1]
      )!;

      const carX =
        xScale(fromNode.x) + (xScale(toNode.x) - xScale(fromNode.x)) * segmentFraction;
      const carY =
        yScale(fromNode.y) + (yScale(toNode.y) - yScale(fromNode.y)) * segmentFraction;

      g.append("circle")
        .attr("cx", carX)
        .attr("cy", carY)
        .attr("r", 12)
        .attr("fill", `hsl(${routeColor})`)
        .attr("stroke", "hsl(var(--background))")
        .attr("stroke-width", 3)
        .style("filter", `drop-shadow(0 0 8px hsl(${routeColor}))`);

      // Car icon (simple triangle pointing in direction of movement)
      const angle = Math.atan2(
        yScale(toNode.y) - yScale(fromNode.y),
        xScale(toNode.x) - xScale(fromNode.x)
      );

      g.append("text")
        .attr("x", carX)
        .attr("y", carY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "16px")
        .attr("transform", `rotate(${(angle * 180) / Math.PI}, ${carX}, ${carY})`)
        .text("🚗")
        .style("pointer-events", "none");
    }
  }, [data, selectedRoute, animationProgress, isAnimating, dimensions]);

  return (
    <div className="w-full h-full rounded-lg border border-border bg-card/30 p-4">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};
