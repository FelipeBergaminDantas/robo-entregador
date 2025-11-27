import { useState, useEffect } from "react";
import { fetchRotas } from "@/services/api";

const IndexSimple = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRotas = async () => {
      try {
        console.log("Buscando rotas...");
        const rotasFromApi = await fetchRotas();
        console.log("Rotas recebidas:", rotasFromApi);
        setRoutes(rotasFromApi);
        setLoading(false);
      } catch (err) {
        console.error("Erro:", err);
        setError("Erro ao carregar rotas");
        setLoading(false);
      }
    };

    loadRotas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <p className="text-2xl">Carregando rotas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-500 mb-4">❌ {error}</p>
          <p>Verifique se o backend está rodando em http://localhost:8080</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">
            Visualizador de Rotas - Grafo Tracer Pro
          </h1>
          <p className="text-lg text-muted-foreground">
            {routes.length} rotas disponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className="p-6 border rounded-lg bg-card hover:bg-accent/10 transition-colors"
            >
              <h3 className="text-xl font-bold mb-2">{route.nome}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Percurso: {route.nosPercorridos?.join(" → ")}
              </p>
              <p className="text-lg font-semibold">
                Distância: {route.distanciaTotal} {route.unidade}
              </p>
              <p className="text-sm text-muted-foreground">
                Tempo: {(route.tempoEstimado / 1000).toFixed(1)}s
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Arestas: {route.arestasPercorridas?.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexSimple;
