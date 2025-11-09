import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Layers, Clock, PawPrint } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ConsultorAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type TrailItem = {
  idTrilha: number;
  nome: string;
  descricao: string;
  nivel: string;
  horasTotais: number;
  modulosTotais: number;
  // optional fields for breed linkage (backend may vary)
  idRaca?: number;
  racaNome?: string;
  nomeRaca?: string;
  raca?: { id?: number; idRaca?: number; nome?: string };
};

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [trails, setTrails] = useState<TrailItem[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [trailDetails, setTrailDetails] = useState<Record<number, TrailItem | null>>({});
  type ModuleItem = { idModulo: number; nome: string; descricao?: string; duracaoHoras?: number };
  const [trailModules, setTrailModules] = useState<Record<number, ModuleItem[]>>({});
  const [loadingTrailData, setLoadingTrailData] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Carregar algumas trilhas para overview (primeira página)
    const load = async () => {
      try {
        setLoadingTrails(true);
        type TrailsResponse = { content?: TrailItem[] } | TrailItem[];
        const resp = await ConsultorAPI.trilhas<TrailsResponse>(token, { page: 0, size: 4 });
        const items: TrailItem[] = Array.isArray(resp) ? resp : (resp.content ?? []);
        setTrails(items ?? []);
      } catch {
        setTrails([]);
      } finally {
        setLoadingTrails(false);
      }
    };
    load();
  }, [token]);

  // Recompensas removidas do dashboard

  const toggleExpand = async (t: TrailItem) => {
    const id = t.idTrilha;
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    const alreadyLoaded = (trailDetails[id] !== undefined) || (trailModules[id] !== undefined);
    if (!alreadyLoaded) {
      setLoadingTrailData((p) => ({ ...p, [id]: true }));
      try {
        const [det, mods] = await Promise.all([
          ConsultorAPI.trilhaDetalhes<TrailItem>(id, token).catch(() => null as unknown as TrailItem),
          ConsultorAPI.trilhaModulos<ModuleItem[]>(id, token).catch(() => [] as ModuleItem[]),
        ]);
        if (det) setTrailDetails((p) => ({ ...p, [id]: det }));
        if (mods) setTrailModules((p) => ({ ...p, [id]: mods }));
      } finally {
        setLoadingTrailData((p) => ({ ...p, [id]: false }));
      }
    }
  };

  const handleDeleteTrail = async (t: TrailItem) => {
    const ok = window.confirm(`Deseja realmente deletar a trilha "${t.nome}"?`);
    if (!ok) return;
    try {
      await ConsultorAPI.deletarTrilha<void>(t.idTrilha, token);
      setTrails((prev) => prev.filter((x) => x.idTrilha !== t.idTrilha));
    } catch {
      // apiFetch já exibe toast de erro
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="container py-8 space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Olá, bem-vindo(a)!</h1>
            <p className="text-muted-foreground">Home do consultor: gerencie trilhas do sistema</p>
          </div>
          <div className="flex gap-2" />
        </div>

        {/* Trilhas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trilhas</h2>
            <Button onClick={() => navigate("/admin/create-trail")} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Trilha
            </Button>
          </div>
          {loadingTrails ? (
            <div className="text-muted-foreground">Carregando trilhas…</div>
          ) : trails.length === 0 ? (
            <div className="text-muted-foreground">Nenhuma trilha encontrada.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trails.map((t) => {
                const det = trailDetails[t.idTrilha] ?? t; // fallback to list item
                const breedField = (det as any).raca;
                const breedName =
                  (det as any).racaNome ||
                  (det as any).nomeRaca ||
                  (typeof breedField === "string" ? breedField : breedField?.nome) ||
                  "—";
                return (
                  <Card
                    key={t.idTrilha}
                    className="shadow-card border border-border/70 bg-card hover:shadow-lg hover:border-primary/30 transition-shadow"
                  >
                    <CardHeader>
                      <button className="w-full text-left" onClick={() => navigate(`/consultor/trilhas/${t.idTrilha}`)}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {det.nome}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">{det.descricao}</CardDescription>
                          </div>
                          <Badge variant="secondary" className="whitespace-nowrap">{det.nivel}</Badge>
                        </div>
                      </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Stats row with icons and clearer layout */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Layers className="h-4 w-4" />
                          <span>Módulos:</span>
                          <span className="font-medium text-foreground">{det.modulosTotais ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Horas:</span>
                          <span className="font-medium text-foreground">{det.horasTotais ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <PawPrint className="h-4 w-4" />
                          <span>Raça:</span>
                          <span className="font-medium text-foreground">{breedName}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => navigate(`/admin/edit-trail/${t.idTrilha}`)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:inline">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteTrail(t)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:inline">Deletar</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
        {/* Recompensas removidas */}
      </main>
    </div>
  );
};

export default ConsultantDashboard;
