import { Route } from "@/types/graph";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface RouteListProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
}

export const RouteList = ({
  routes,
  selectedRoute,
  onSelectRoute,
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

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto py-4 px-4 transition-all ${
                  isSelected
                    ? "bg-accent hover:bg-accent/90 border-accent"
                    : "hover:bg-secondary"
                }`}
                onClick={() => onSelectRoute(route)}
              >
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      Rota {index + 1}
                    </span>
                    <Badge
                      variant={isSelected ? "secondary" : "outline"}
                      className="ml-2"
                    >
                      {route.distance} km
                    </Badge>
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
