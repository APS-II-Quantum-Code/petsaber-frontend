import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";
import type { TrailProgressCardData } from "@/components/learning/TrailCard";
import { TutorAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const TrailDetails = () => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const trail = (location.state as { trail?: TrailProgressCardData } | null)?.trail;
  const [trailData, setTrailData] = useState<TrailProgressCardData | null>(trail ?? null);
  const { token } = useAuth();

  type TrailModule = {
    idModulo: number;
    nomeModulo: string;
    status: string;
  };

  const trailId = useMemo(() => trailData?.trailId ?? trail?.trailId ?? _id ?? "", [trailData?.trailId, trail?.trailId, _id]);
  const [modules, setModules] = useState<TrailModule[] | null>(null);
  const [loadingModules, setLoadingModules] = useState<boolean>(false);
  const [modulesError, setModulesError] = useState<string | null>(null);

  // Sequenciamento: permitir apenas um módulo por vez (o primeiro não concluído)
  const firstIncompleteIndex = useMemo(() => {
    if (!modules || modules.length === 0) return -1;
    const idx = modules.findIndex((m) => !((m.status || "").toLowerCase().includes("conclu")));
    return idx === -1 ? modules.length - 1 : idx; // se todos concluídos, considera o último como referência
  }, [modules]);

  // Restore from sessionStorage if opened without state
  useEffect(() => {
    if (!trailData && _id) {
      try {
        const raw = sessionStorage.getItem(`trail:${_id}`);
        if (raw) {
          const parsed = JSON.parse(raw) as TrailProgressCardData;
          setTrailData(parsed);
        }
      } catch {}
    }
  }, [_id, trailData]);

  // Types to map list responses
  type TutorTrailProgressResponse = {
    content: Array<{
      idProgressoTrilha: number;
      dataInicio: string | null;
      dataConclusao: string | null;
      status: string;
      modulosConcluidos: number;
      trilha: {
        idTrilha: number;
        nome: string;
        descricao: string;
        nivel: string;
        horasTotais: number;
        modulosTotais: number;
      };
    }>;
  };
  type TutorAvailableTrailsResponse = {
    content: Array<{
      idTrilha: number;
      nome: string;
      descricao: string;
      nivel: string;
      horasTotais: number;
      modulosTotais: number;
    }>;
  };

  // Always fetch trail details (progress/metadata) and modules on load
  useEffect(() => {
    const fetchAll = async () => {
      if (!token || !trailId) return;

      // 1) Try to find in minhasTrilhas
      try {
        const prog = await TutorAPI.minhasTrilhas<TutorTrailProgressResponse>(token);
        const found = (prog?.content ?? []).find((it) => String(it.trilha.idTrilha) === String(trailId));
        if (found) {
          const mapped: TrailProgressCardData = {
            id: String(found.idProgressoTrilha),
            trailId: String(found.trilha.idTrilha),
            progressId: String(found.idProgressoTrilha),
            title: found.trilha.nome,
            description: found.trilha.descricao,
            totalModules: found.trilha.modulosTotais,
            completedModules: found.modulosConcluidos,
            totalHours: found.trilha.horasTotais,
            difficulty: found.trilha.nivel,
            status: found.status,
            startedAt: found.dataInicio,
            finishedAt: found.dataConclusao,
          };
          setTrailData(mapped);
          try { sessionStorage.setItem(`trail:${mapped.trailId}`, JSON.stringify(mapped)); } catch {}
        } else {
          // 2) If not found, get from available trails
          const avail = await TutorAPI.trilhasDisponiveis<TutorAvailableTrailsResponse>(token);
          const a = (avail?.content ?? []).find((it) => String(it.idTrilha) === String(trailId));
          if (a) {
            const mapped: TrailProgressCardData = {
              id: String(a.idTrilha),
              trailId: String(a.idTrilha),
              title: a.nome,
              description: a.descricao,
              totalModules: a.modulosTotais,
              completedModules: 0,
              totalHours: a.horasTotais,
              difficulty: a.nivel,
              status: "Não Iniciada",
              startedAt: null,
              finishedAt: null,
            };
            setTrailData(mapped);
            try { sessionStorage.setItem(`trail:${mapped.trailId}`, JSON.stringify(mapped)); } catch {}
          }
        }
      } catch {
        // ignore errors here; modules fetch still runs
      }

      // 3) Fetch modules
      setLoadingModules(true);
      setModulesError(null);
      try {
        const resp = await TutorAPI.trilhaMeuProgresso<TrailModule[]>(trailId, token);
        setModules(resp ?? []);
      } catch (e: any) {
        setModulesError(e?.message || "Erro ao carregar módulos");
        setModules([]);
      } finally {
        setLoadingModules(false);
      }
    };
    fetchAll();
  }, [token, trailId]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/tutor">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>

          {!trailData ? (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Detalhes da Trilha</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Não foi possível carregar os detalhes da trilha diretamente. Acesse esta página através do Dashboard do Tutor.
                </p>
                <Button onClick={() => navigate("/tutor")}>Voltar ao Dashboard</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="shadow-card mb-8">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <CardTitle className="text-3xl">{trailData.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{trailData.description}</p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">Nível: {trailData.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">Status: {trailData.status}</Badge>
                      <Badge variant="outline" className="text-xs">Duração: {trailData.totalHours}h</Badge>
                      <Badge variant="outline" className="text-xs">Módulos: {trailData.totalModules}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{trailData.completedModules}/{trailData.totalModules} módulos</span>
                      </div>
                      <Progress value={trailData.totalModules > 0 ? (trailData.completedModules / trailData.totalModules) * 100 : 0} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Módulos da Trilha</h2>
                {loadingModules ? (
                  <p className="text-muted-foreground">Carregando módulos…</p>
                ) : modulesError ? (
                  <p className="text-destructive">{modulesError}</p>
                ) : !modules || modules.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum módulo encontrado.</p>
                ) : (
                  <div className="grid gap-3">
                    {modules.map((m, idx) => {
                      const statusLower = (m.status || "").toLowerCase();
                      const isCompleted = statusLower.includes("conclu");
                      const isInProgress = statusLower.includes("andament");
                      const isUnlocked = isCompleted || idx === firstIncompleteIndex; // concluído sempre liberado (revisar), caso contrário apenas o primeiro não concluído
                      const ctaLabel = isCompleted ? "Revisar" : isInProgress ? "Continuar" : idx === firstIncompleteIndex ? "Iniciar" : "Bloqueado";

                      return (
                        <Card key={m.idModulo} className={`border-muted ${!isUnlocked ? "opacity-60" : ""}`}>
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-primary" : isInProgress ? "bg-blue-500" : "bg-muted"}`} />
                              <div>
                                <p className="font-medium text-sm">{m.nomeModulo}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs">{m.status}</Badge>
                              <Button
                                size="sm"
                                disabled={!isUnlocked}
                                onClick={() => isUnlocked && navigate(`/module/${trailId}/${m.idModulo}`)}
                                variant={isUnlocked ? "default" : "secondary"}
                                className="gap-2"
                              >
                                {isUnlocked ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                {ctaLabel}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default TrailDetails;