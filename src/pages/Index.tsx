import { useState, useEffect, useCallback } from "react";
import { graphData, ANIMATION_CONFIG } from "@/data/graphData";
import { PathFinder } from "@/utils/pathfinder";
import { Route } from "@/types/graph";
import { GraphVisualization } from "@/components/GraphVisualization";
import { RouteList } from "@/components/RouteList";
import { AnimationControls } from "@/components/AnimationControls";
import { Card } from "@/components/ui/card";

// Generate heatmap colors based on time (green -> yellow -> red)
const generateHeatmapColor = (time: number, minTime: number, maxTime: number): string => {
  // Normalize time to 0-1 range
  const normalized = (time - minTime) / (maxTime - minTime);
  
  // Green (120, 100%, 35%) -> Yellow (50, 100%, 50%) -> Red (0, 100%, 50%)
  let hue: number;
  let saturation: number;
  let lightness: number;
  
  if (normalized < 0.5) {
    // Green to Yellow
    const t = normalized * 2;
    hue = 120 - (70 * t); // 120 to 50
    saturation = 76 + (24 * t); // 76% to 100%
    lightness = 36 + (14 * t); // 36% to 50%
  } else {
    // Yellow to Red
    const t = (normalized - 0.5) * 2;
    hue = 50 - (50 * t); // 50 to 0
    saturation = 100;
    lightness = 50 + (10 * t); // 50% to 60%
  }
  
  return `${Math.round(hue)} ${Math.round(saturation)}% ${Math.round(lightness)}%`;
};

const Index = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [routeColors, setRouteColors] = useState<string[]>([]);

  // Calculate all routes on mount
  useEffect(() => {
    const pathfinder = new PathFinder(graphData.edges);
    const allRoutes = pathfinder.findAllPaths("A", "G");
    setRoutes(allRoutes);
    
    // Calculate heatmap colors based on time
    if (allRoutes.length > 0) {
      const times = allRoutes.map(r => r.time);
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      const colors = allRoutes.map(route => 
        generateHeatmapColor(route.time, minTime, maxTime)
      );
      setRouteColors(colors);
    }
    
    // Auto-select first route
    if (allRoutes.length > 0) {
      setSelectedRoute(allRoutes[0]);
      setSelectedRouteIndex(0);
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || !startTime || !selectedRoute) return;

    let animationFrameId: number;
    const animationDuration = selectedRoute.time; // Use route time in minutes

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000 + pausedTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setStartTime(null);
        setPausedTime(0);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isAnimating, startTime, pausedTime, selectedRoute]);

  const handlePlay = useCallback(() => {
    if (!selectedRoute) return;
    
    setIsAnimating(true);
    setStartTime(performance.now());
  }, [selectedRoute]);

  const handlePause = useCallback(() => {
    setIsAnimating(false);
    setPausedTime((prev) => prev + (performance.now() - (startTime || 0)) / 1000);
    setStartTime(null);
  }, [startTime]);

  const handleReset = useCallback(() => {
    setIsAnimating(false);
    setAnimationProgress(0);
    setStartTime(null);
    setPausedTime(0);
  }, []);

  const handleSelectRoute = useCallback((route: Route, index: number) => {
    setSelectedRoute(route);
    setSelectedRouteIndex(index);
    handleReset();
  }, [handleReset]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Visualizador Interativo de Trajetos em Grafos
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore e visualize diferentes rotas através do grafo de estradas
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Visualization - Takes 2 columns on large screens */}
          <Card className="lg:col-span-2 p-6">
            <div className="space-y-4">
              <div className="h-[600px]">
          <GraphVisualization
            data={graphData}
            selectedRoute={selectedRoute}
            animationProgress={animationProgress}
            isAnimating={isAnimating}
            routeColor={selectedRouteIndex !== null ? routeColors[selectedRouteIndex] : undefined}
          />
              </div>

              {/* Animation Controls */}
              <AnimationControls
                isAnimating={isAnimating}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                duration={selectedRoute?.time || 0}
                onDurationChange={() => {}} // No longer needed
                disabled={!selectedRoute}
                hideDurationControl={true}
              />

              {/* Current Route Info */}
              {selectedRoute && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Rota Selecionada
                      </p>
                      <p className="font-mono text-lg font-semibold">
                        {selectedRoute.path.join(" → ")}
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                          Distância Total
                        </p>
                        <p className="text-2xl font-bold text-accent">
                          {selectedRoute.distance} km
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                          Tempo Estimado
                        </p>
                        <p className="text-2xl font-bold"
                           style={{ color: `hsl(${selectedRouteIndex !== null ? routeColors[selectedRouteIndex] : '142 76% 36%'})` }}>
                          {selectedRoute.time} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Route List - Takes 1 column */}
          <Card className="p-6 h-[700px]">
            <RouteList
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleSelectRoute}
              routeColors={routeColors}
            />
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(120 76% 36%)' }}></div>
              <span className="text-muted-foreground">Rápido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(50 100% 50%)' }}></div>
              <span className="text-muted-foreground">Médio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(0 100% 60%)' }}></div>
              <span className="text-muted-foreground">Lento</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Desenvolvido com D3.js • {routes.length} rotas possíveis • Algoritmo DFS • Velocidade média: 60 km/h
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
