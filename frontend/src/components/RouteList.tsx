import { Route } from "@/types/graph";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Play } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { executarRota1, executarRota2, executarRota3, executarRota4, executarRota5, executarRota6, executarRota7 } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface RouteListProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelectRoute: (route: Route, index: number) => void;
  routeColors: string[];
  onStartAnimation?: () => void;
}

export const RouteList = ({
  routes,
  selectedRoute,
  onSelectRoute,
  routeColors,
  onStartAnimation,
}: RouteListProps) => {
  const { toast } = useToast();

  const handleExecutarRota = async (route: Route, e: any) => {
    e.stopPropagation();
    
    // Primeiro, seleciona a rota se não estiver selecionada
    if (selectedRoute?.id !== route.id) {
      const routeIndex = routes.findIndex(r => r.id === route.id);
      if (routeIndex !== -1) {
        onSelectRoute(route, routeIndex);
      }
    }
    
    // Inicia a animação IMEDIATAMENTE
    if (onStartAnimation) {
      onStartAnimation();
    }
    
    // Mapeia o ID da rota para a função correta
    const rotasMap: { [key: number]: () => Promise<any> } = {
      1: executarRota1,
      2: executarRota2,
      3: executarRota3,
      4: executarRota4,
      5: executarRota5,
      6: executarRota6,
      7: executarRota7
    };
    
    const funcaoRota = rotasMap[route.id];
    if (funcaoRota) {
      funcaoRota().then(result => {
        if (result && result.sucesso) {
          toast({
            title: "✅ Comando Enviado!",
            description: `${result.comando} - ${result.caminho}`,
          });
        } else {
          toast({
            title: "⚠️ Aviso",
            description: result?.mensagem || "Erro ao enviar comando para ESP8266",
            variant: "default",
          });
        }
      });
    } else {
      toast({
        title: "❌ Erro",
        description: `Rota ${route.id} não encontrada`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Rotas Disponíveis
        </h2>
        <p className="text-sm text-muted-foreground">
          {routes.length} rota{routes.length !== 1 ? "s" : ""} disponíve
          {routes.length !== 1 ? "is" : "l"}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {routes.map((route, index) => {
            const isSelected = selectedRoute?.id === route.id;
            const routeColor = routeColors[index] || "142 76% 36%";

            return (
              <div
                key={route.id}
                className={`w-full text-left h-auto py-4 px-4 transition-all cursor-pointer rounded-lg border ${
                  isSelected ? "hover:opacity-90" : "hover:bg-secondary"
                }`}
                style={{
                  borderLeft: `4px solid hsl(${routeColor})`,
                  backgroundColor: isSelected
                    ? `hsl(${routeColor} / 0.15)`
                    : undefined,
                  borderColor: isSelected ? `hsl(${routeColor})` : undefined,
                }}
                onClick={() => onSelectRoute(route, index)}
              >
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{route.nome}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isSelected ? "secondary" : "outline"}
                        style={{
                          backgroundColor: isSelected
                            ? `hsl(${routeColor})`
                            : undefined,
                          borderColor: `hsl(${routeColor})`,
                          color: isSelected
                            ? "hsl(var(--background))"
                            : undefined,
                        }}
                      >
                        {route.distanciaTotal} {route.unidade}
                      </Badge>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 p-0 hover:bg-primary/10"
                              onClick={(e) => handleExecutarRota(route, e)}
                            >
                              <Play
                                className="h-4 w-4"
                                style={{ color: `hsl(${routeColor})` }}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="text-xs">Executar rota</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="text-xs font-mono opacity-90">
                    {route.nosPercorridos?.join(" → ") || "N/A"}
                  </div>
                  {route.arestasPercorridas && route.arestasPercorridas.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Arestas: {route.arestasPercorridas.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {routes.length === 0 && ( 
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>Carregando rotas...</p>
        </div>
      )}
    </div>
  );
};
