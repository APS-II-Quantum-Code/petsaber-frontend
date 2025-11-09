import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, ListChecks, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TutorAPI, ConsultorAPI } from "@/lib/api";

// Admin read-only view for module details (nome, descricao, duracao, conteudo, exercicios)
const AdminModuleDetails = () => {
  const { trailId, moduleId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  type ModuloDetalhes = {
    idModulo: number;
    nome: string;
    descricao?: string;
    duracaoHoras?: number;
    conteudo?: string;
  };
  type Alternativa = { idAlternativa: number; conteudo: string };
  type Exercicio = { idExercicio: number; nome: string; descricao?: string; alternativas?: Alternativa[] };

  const [details, setDetails] = useState<ModuloDetalhes | null>(null);
  const [exercises, setExercises] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = moduleId ?? "";
    if (!id || !token) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [det, exs] = await Promise.all([
          ConsultorAPI.moduloDetalhes<ModuloDetalhes>(id, token).catch(() => null as any),
          ConsultorAPI.exerciciosDoModulo<Exercicio[]>(id, token).catch(() => [] as any),
        ]);
        setDetails(det ?? null);
        setExercises(exs ?? []);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar módulo");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [moduleId, token]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/consultor/trilhas/${trailId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{loading ? "Carregando…" : (details?.nome || "Módulo")}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {!!details?.duracaoHoras && (
                    <Badge variant="outline">{details.duracaoHoras}h</Badge>
                  )}
                  {!loading && (
                    <Button
                      className="gap-2"
                      onClick={() => navigate(`/admin/edit-module/${trailId}/${moduleId}`)}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar módulo
                    </Button>
                  )}
                </div>
              </div>
              {!!details?.descricao && (
                <p className="text-sm text-muted-foreground">{details.descricao}</p>
              )}
            </CardHeader>
            <CardContent>
              {error && <div className="text-destructive text-sm">{error}</div>}
              {loading && <div className="text-muted-foreground">Carregando dados…</div>}
            </CardContent>
          </Card>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Carregando conteúdo…</p>
              ) : details?.conteudo ? (
                <div className="prose prose-slate max-w-none">
                  {details.conteudo.split('\n').map((p, i) => (
                    p.trim() ? (
                      <p key={i} className="text-muted-foreground leading-relaxed mb-3">{p}</p>
                    ) : (
                      <br key={i} />
                    )
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Sem conteúdo cadastrado.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-6 w-6 text-primary" />
                  <CardTitle>Exercícios</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  {!!details?.idModulo && (
                    <Badge variant="outline">
                      {exercises.length} itens
                    </Badge>
                  )}
                  <Button size="sm" onClick={() => navigate(`/admin/create-exercise/${trailId}/${moduleId}`)}>
                    Adicionar exercício
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Carregando exercícios…</p>
              ) : exercises.length === 0 ? (
                <p className="text-muted-foreground">Nenhum exercício cadastrado.</p>
              ) : (
                <div className="space-y-3">
                  {exercises.map((ex, idx) => (
                    <button
                      key={ex.idExercicio}
                      className="w-full text-left rounded-md border p-4 bg-card/40 hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/admin/exercise/${trailId}/${moduleId}/${ex.idExercicio}`)}
                      role="button"
                      aria-label={`Abrir detalhes do exercício ${ex.nome}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="uppercase">Exercício {idx + 1}</Badge>
                        <span className="font-medium text-foreground">{ex.nome}</span>
                      </div>

                      {/* Pergunta (descrição) como destaque */}
                      {!!ex.descricao && (
                        <div className="rounded-md border bg-background p-3 mb-3">
                          <div className="text-xs font-semibold text-muted-foreground mb-1">Pergunta</div>
                          <div className="text-sm leading-relaxed text-foreground/90">{ex.descricao}</div>
                        </div>
                      )}

                      {/* Alternativas removidas desta tela; disponíveis no detalhe do exercício */}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>
  );
};

export default AdminModuleDetails;
