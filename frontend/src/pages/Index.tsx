import { useState, useEffect, useCallback } from "react";
import { graphData } from "@/data/graphData";
import { Route } from "@/types/graph";
import { GraphVisualization } from "@/components/GraphVisualization";
import { RouteList } from "@/components/RouteList";
import { AnimationControls } from "@/components/AnimationControls";
import { Card } from "@/components/ui/card";
import { fetchRotas } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// Generate heatmap colors based on distance (green -> yellow -> red)
const generateHeatmapColor = (distance: number, minDist: number, maxDist: number): string => {
  const normalized = (distance - minDist) / (maxDist - minDist);
  
  let hue: number;
  let saturation: number;
  let lightness: number;
  
  if (normalized < 0.5) {
    const t = normalized * 2;
    hue = 120 - (70 * t);
    saturation = 76 + (24 * t);
    lightness = 36 + (14 * t);
  } else {
    const t = (normalized - 0.5) * 2;
    hue = 50 - (50 * t);
    saturation = 100;
    lightness = 50 + (10 * t);
  }
  
  return `${Math.round(hue)} ${Math.round(saturation)}% ${Math.round(lightness)}%`;
};

const Index = () => {
  console.log("Index component mounted");
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [routeColors, setRouteColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  // Fetch routes from API on mount
  useEffect(() => {
    console.log("useEffect triggered");
    const loadRotas = async () => {
      try {
        console.log("Fetching routes...");
        const rotasFromApi = await fetchRotas();
        console.log("Routes received:", rotasFromApi);
        console.log("First route:", rotasFromApi[0]);
        
        if (rotasFromApi.length === 0) {
          console.log("No routes received");
          toast({
            title: "Erro ao carregar rotas",
            description: "Backend não está respondendo",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const formattedRoutes: Route[] = rotasFromApi.map((rota) => {
          const nosPercorridos = Array.isArray(rota.nosPercorridos) ? [...rota.nosPercorridos] : [];
          const arestasPercorridas = Array.isArray(rota.arestasPercorridas) ? [...rota.arestasPercorridas] : [];
          
          return {
            id: rota.id,
            nome: rota.nome,
            path: nosPercorridos,
            distance: rota.distanciaTotal || 0,
            nosPercorridos: nosPercorridos,
            distanciaTotal: rota.distanciaTotal || 0,
            unidade: rota.unidade || "cm",
            tempoEstimado: rota.tempoEstimado || 5000,
            arestasPercorridas: arestasPercorridas,
          };
        });

        // Ordenar rotas por distância (do mais rápido para o mais lento)
        formattedRoutes.sort((a, b) => a.distanciaTotal - b.distanciaTotal);

        console.log("Formatted routes:", formattedRoutes);
        console.log("First formatted route:", formattedRoutes[0]);
        
        setRoutes(formattedRoutes);

        if (formattedRoutes.length > 0) {
          const distances = formattedRoutes.map((r) => r.distanciaTotal);
          const minDist = Math.min(...distances);
          const maxDist = Math.max(...distances);

          const colors = formattedRoutes.map((route) =>
            generateHeatmapColor(route.distanciaTotal, minDist, maxDist)
          );
          setRouteColors(colors);

          setSelectedRoute(formattedRoutes[0]);
          setSelectedRouteIndex(0);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar rotas:", err);
        setLoading(false);
      }
    };

    loadRotas();
  }, [toast]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || !startTime || !selectedRoute) return;

    let animationFrameId: number;
    const animationDuration = selectedRoute.tempoEstimado / 1000;

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
        
        // Notificação de conclusão
        toast({
          title: "✅ Animação Concluída!",
          description: `${selectedRoute.nome} percorrida com sucesso!`,
        });
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
    
    // Notificação de início
    toast({
      title: "🚗 Animação Iniciada!",
      description: `Percorrendo ${selectedRoute.nome}: ${selectedRoute.nosPercorridos?.join(" → ")}`,
    });
    
    setIsAnimating(true);
    setStartTime(performance.now());
  }, [selectedRoute, toast]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <p className="text-2xl">Carregando rotas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Robô Entregador Autônomo com Rotas Otimizadas
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistema inteligente de otimização de rotas para entregas autônomas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <AnimationControls
                isAnimating={isAnimating}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                duration={(selectedRoute?.tempoEstimado || 0) / 1000}
                onDurationChange={() => {}}
                disabled={!selectedRoute}
                hideDurationControl={true}
                hideResetButton={true}
              />

              {selectedRoute && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Rota Selecionada
                      </p>
                      <p className="font-mono text-lg font-semibold">
                        {selectedRoute.nosPercorridos?.join(" → ") || selectedRoute.path?.join(" → ") || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">
                        Distância Total
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        {selectedRoute.distanciaTotal || selectedRoute.distance || 0} {selectedRoute.unidade || "cm"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 h-[700px]">
            <RouteList
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleSelectRoute}
              routeColors={routeColors}
              onStartAnimation={handlePlay}
            />
          </Card>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(120 76% 36%)' }}></div>
              <span className="text-muted-foreground">Curta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(50 100% 50%)' }}></div>
              <span className="text-muted-foreground">Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(0 100% 60%)' }}></div>
              <span className="text-muted-foreground">Longa</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Engenharia da Computação - UNIFECAF
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
