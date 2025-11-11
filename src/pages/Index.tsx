import { useState, useEffect, useCallback } from "react";
import { graphData, ANIMATION_CONFIG } from "@/data/graphData";
import { PathFinder } from "@/utils/pathfinder";
import { Route } from "@/types/graph";
import { GraphVisualization } from "@/components/GraphVisualization";
import { RouteList } from "@/components/RouteList";
import { AnimationControls } from "@/components/AnimationControls";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(
    ANIMATION_CONFIG.defaultDuration
  );
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);

  // Calculate all routes on mount
  useEffect(() => {
    const pathfinder = new PathFinder(graphData.edges);
    const allRoutes = pathfinder.findAllPaths("A", "G");
    setRoutes(allRoutes);
    
    // Auto-select first route
    if (allRoutes.length > 0) {
      setSelectedRoute(allRoutes[0]);
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || !startTime) return;

    let animationFrameId: number;

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
  }, [isAnimating, startTime, animationDuration, pausedTime]);

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

  const handleSelectRoute = useCallback((route: Route) => {
    setSelectedRoute(route);
    handleReset();
  }, [handleReset]);

  const handleDurationChange = useCallback((value: number) => {
    setAnimationDuration(value);
    if (isAnimating) {
      handleReset();
    }
  }, [isAnimating, handleReset]);

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
                />
              </div>

              {/* Animation Controls */}
              <AnimationControls
                isAnimating={isAnimating}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                duration={animationDuration}
                onDurationChange={handleDurationChange}
                disabled={!selectedRoute}
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
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">
                        Distância Total
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        {selectedRoute.distance} km
                      </p>
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
            />
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Desenvolvido com D3.js • {routes.length} rotas possíveis • Algoritmo
            DFS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
