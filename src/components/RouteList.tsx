import { Route } from "@/types/graph";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface RouteListProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelectRoute: (route: Route, index: number) => void;
  routeColors: string[];
}

export const RouteList = ({
  routes,
  selectedRoute,
  onSelectRoute,
  routeColors,
}: RouteListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Rotas Disponíveis
        </h2>
        <p className="text-sm text-muted-foreground">
          {routes.length} rota{routes.length !== 1 ? "s" : ""} encontrada
          {routes.length !== 1 ? "s" : ""} de A → G
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {routes.map((route, index) => {
            const isSelected =
              selectedRoute?.path.join("-") === route.path.join("-");
            
            const routeColor = routeColors[index] || "142 76% 36%";

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto py-4 px-4 transition-all ${
                  isSelected
                    ? "hover:opacity-90"
                    : "hover:bg-secondary"
                }`}
                style={{
                  borderLeft: `4px solid hsl(${routeColor})`,
                  backgroundColor: isSelected ? `hsl(${routeColor} / 0.15)` : undefined,
                  borderColor: isSelected ? `hsl(${routeColor})` : undefined,
                }}
                onClick={() => onSelectRoute(route, index)}
              >
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      Rota {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isSelected ? "secondary" : "outline"}
                        style={{
                          backgroundColor: isSelected ? `hsl(${routeColor})` : undefined,
                          borderColor: `hsl(${routeColor})`,
                          color: isSelected ? 'hsl(var(--background))' : undefined,
                        }}
                      >
                        {route.distance} km
                      </Badge>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 p-0 hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Clock className="h-4 w-4" style={{ color: `hsl(${routeColor})` }} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="font-semibold">{route.time} min</p>
                            <p className="text-xs text-muted-foreground">Tempo estimado (com curvas)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="text-xs font-mono opacity-90">
                    {route.path.join(" → ")}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {routes.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>Nenhuma rota encontrada</p>
        </div>
      )}
    </div>
  );
};
