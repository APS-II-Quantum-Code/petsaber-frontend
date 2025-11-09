import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen } from "lucide-react";
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
                {!!details?.duracaoHoras && (
                  <Badge variant="outline">{details.duracaoHoras}h</Badge>
                )}
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
              <CardTitle className="text-xl">Exercícios</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Carregando exercícios…</p>
              ) : exercises.length === 0 ? (
                <p className="text-muted-foreground">Nenhum exercício cadastrado.</p>
              ) : (
                <div className="space-y-4">
                  {exercises.map((ex) => (
                    <div key={ex.idExercicio} className="rounded-md border p-4">
                      <div className="font-medium">{ex.nome}</div>
                      {!!ex.descricao && (
                        <div className="text-sm text-muted-foreground mb-2">{ex.descricao}</div>
                      )}
                      {!!ex.alternativas?.length && (
                        <ul className="list-disc pl-6 text-sm text-muted-foreground">
                          {ex.alternativas.map((alt) => (
                            <li key={alt.idAlternativa}>{alt.conteudo}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => navigate(`/admin/create-content/${trailId}/${moduleId}`)}>
              Editar Conteúdo/Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModuleDetails;
