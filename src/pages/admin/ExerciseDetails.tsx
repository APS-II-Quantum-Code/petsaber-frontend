import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CircleDot, Plus, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ConsultorAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Alternativa { idAlternativa: number; conteudo: string; correta?: boolean }
interface Exercicio { idExercicio: number; nome: string; descricao?: string; alternativas?: Alternativa[]; pontuacao?: number }

const ExerciseDetails = () => {
  const { trailId, moduleId, exerciseId } = useParams();
  const { token } = useAuth();
  const { toast } = useToast();
  const [exercise, setExercise] = useState<Exercicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alternativas, setAlternativas] = useState<Alternativa[]>([]);
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [pontuacao, setPontuacao] = useState<string>("");
  const [altsEdit, setAltsEdit] = useState<Alternativa[]>([]);
  const [savingExercise, setSavingExercise] = useState(false);
  const [savingAltId, setSavingAltId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAltId, setEditingAltId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!moduleId || !token || !exerciseId) return;
      setLoading(true);
      setError(null);
      try {
        const list = await ConsultorAPI.exerciciosDoModulo<Exercicio[]>(moduleId, token);
        const found = (list || []).find((e) => String(e.idExercicio) === String(exerciseId)) || null;
        setExercise(found);
        setNome(found?.nome ?? "");
        setDescricao(found?.descricao ?? "");
        setPontuacao(
          found?.pontuacao !== undefined && found?.pontuacao !== null
            ? String(found.pontuacao)
            : ""
        );
        // Busca alternativas específicas do exercício
        const alts = await ConsultorAPI.alternativasDoExercicio<Alternativa[]>(exerciseId, token);
        const safeAlts = alts || [];
        setAlternativas(safeAlts);
        setAltsEdit(safeAlts.map((a) => ({ ...a })));
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar exercício");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [moduleId, token, exerciseId]);

  const dirtyExercise = (
    nome !== (exercise?.nome ?? "") ||
    descricao !== (exercise?.descricao ?? "") ||
    (pontuacao !== ((exercise?.pontuacao ?? "") as any).toString())
  );
  const altIsDirty = (alt: Alternativa) => {
    const orig = alternativas.find(a => a.idAlternativa === alt.idAlternativa);
    if (!orig) return true;
    return (orig.conteudo !== alt.conteudo) || (Boolean(orig.correta) !== Boolean(alt.correta));
  };

  const resetAlt = (id: number) => {
    const orig = alternativas.find(a => a.idAlternativa === id);
    if (!orig) {
      // se for uma alternativa recém-criada (sem original), remove
      setAltsEdit(prev => prev.filter(a => a.idAlternativa !== id));
      return;
    }
  };

  const handleSaveExercise = async () => {
    setSavingExercise(true);
    try {
      // Validate pontuação (inteiro >= 0 ou vazio)
      const p = pontuacao.trim();
      if (p && (!/^\d+$/.test(p) || parseInt(p, 10) < 0)) {
        toast({ title: "Validação", description: "Pontuação deve ser um inteiro válido (0 ou maior).", variant: "destructive" });
        return;
      }
      const id = exerciseId as string;
      const body = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        pontuacao: p ? Number(p) : null,
      };
      await ConsultorAPI.atualizarExercicio<any>(id, body, token);
      // Reflect changes locally
      setExercise((prev) => prev ? ({ ...prev, nome: body.nome, descricao: body.descricao, pontuacao: body.pontuacao ?? undefined }) : prev);
      setNome(body.nome);
      setDescricao(body.descricao);
      setPontuacao(body.pontuacao ? String(body.pontuacao) : "");
      setIsEditing(false);
      toast({ title: "Exercício atualizado", description: "As alterações foram salvas." });
    } finally {
      setSavingExercise(false);
    }
  };
  const handleSaveAlternative = async (alt: Alternativa) => {
    // Criação para alternativas temporárias (id negativo)
    if (alt.idAlternativa < 0) {
      setSavingAltId(alt.idAlternativa);
      try {
        const created: any = await ConsultorAPI.criarAlternativa<any>(exerciseId as string, {
          conteudo: alt.conteudo.trim(),
          correta: Boolean(alt.correta),
        }, token);
        const newId = created?.idAlternativa ?? created?.id ?? created?.data?.idAlternativa;
        if (newId) {
          // substitui a alternativa temporária pelo objeto persistido
          const persisted = { ...alt, idAlternativa: Number(newId) };
          setAltsEdit(prev => prev.map(a => a.idAlternativa === alt.idAlternativa ? persisted : a));
          setAlternativas(prev => [...prev, persisted]);
          toast({ title: "Alternativa criada", description: "A alternativa foi adicionada." });
        }
        setEditingAltId(null);
      } finally {
        setSavingAltId(null);
      }
      return;
    }
    // Atualização para alternativas já persistidas
    setSavingAltId(alt.idAlternativa);
    try {
      await ConsultorAPI.atualizarAlternativa<any>(alt.idAlternativa, { conteudo: alt.conteudo.trim(), correta: Boolean(alt.correta) }, token);
      setAlternativas(prev => prev.map(a => a.idAlternativa === alt.idAlternativa ? { ...a, conteudo: alt.conteudo, correta: alt.correta } : a));
      toast({ title: "Alternativa atualizada", description: "As alterações foram salvas." });
      setEditingAltId(null);
    } finally {
      setSavingAltId(null);
    }
  };

  const handleAddAlternative = () => {
    const tempId = -Math.floor(Math.random() * 1_000_000) - 1; // id temporário negativo
    const letter = String.fromCharCode(65 + (altsEdit.length % 26));
    setAltsEdit(prev => [...prev, { idAlternativa: tempId, conteudo: `Alternativa ${letter}`, correta: false }]);
    setEditingAltId(tempId);
  };

  const handleDeleteAlternative = async (alt: Alternativa) => {
    const confirmDel = window.confirm("Deseja remover esta alternativa?");
    if (!confirmDel) return;
    // Se for temporária, apenas remove localmente
    if (alt.idAlternativa < 0) {
      setAltsEdit(prev => prev.filter(a => a.idAlternativa !== alt.idAlternativa));
      toast({ title: "Alternativa removida", description: "Removida localmente." });
      return;
    }
    try {
      await ConsultorAPI.deletarAlternativa<any>(alt.idAlternativa, token);
      setAltsEdit(prev => prev.filter(a => a.idAlternativa !== alt.idAlternativa));
      setAlternativas(prev => prev.filter(a => a.idAlternativa !== alt.idAlternativa));
      toast({ title: "Alternativa removida", description: "Exclusão concluída." });
    } catch (e: any) {
      toast({ title: "Erro ao excluir", description: e?.message || "Tente novamente.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/admin/module/${trailId}/${moduleId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Detalhe do Exercício</h1>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{loading ? "Carregando…" : (exercise?.nome || "Exercício")}</CardTitle>
                {!loading && !error && (
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // cancelar edição: restaurar e sair do modo edição
                            setNome(exercise?.nome ?? "");
                            setDescricao(exercise?.descricao ?? "");
                            setAltsEdit(alternativas.map((a) => ({ ...a })));
                            setPontuacao(
                              exercise?.pontuacao !== undefined && exercise?.pontuacao !== null
                                ? String(exercise.pontuacao)
                                : ""
                            );
                            setIsEditing(false);
                          }}
                        >
                          Cancelar edição
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" onClick={() => setIsEditing(true)}>Editar</Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-muted-foreground">Carregando dados…</p>}
              {error && <p className="text-destructive text-sm">{error}</p>}
              {!loading && !error && (
                isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título</label>
                      <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Exercício 1" />
                    </div>

                    <div className="rounded-md border bg-background p-3 space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground">Pergunta</div>
                      <Textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Digite a pergunta do exercício"
                        rows={4}
                      />
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Pontuação (opcional)</label>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={pontuacao}
                          onChange={(e) => setPontuacao(e.target.value)}
                          placeholder="Ex.: 10"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setNome(exercise?.nome ?? "");
                            setDescricao(exercise?.descricao ?? "");
                            setPontuacao(
                              exercise?.pontuacao !== undefined && exercise?.pontuacao !== null
                                ? String(exercise.pontuacao)
                                : ""
                            );
                          }}
                          disabled={!dirtyExercise || savingExercise}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveExercise} disabled={!dirtyExercise || savingExercise}>
                          {savingExercise ? "Salvando..." : "Salvar exercício"}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <CircleDot className="h-3.5 w-3.5" />
                          <span>Alternativas</span>
                        </div>
                        <Button size="sm" className="gap-2" onClick={handleAddAlternative}>
                          <Plus className="h-4 w-4" />
                          Adicionar alternativa
                        </Button>
                      </div>
                      {altsEdit && altsEdit.length > 0 ? (
                        <ul className="space-y-2">
                          {altsEdit.map((alt, idx) => {
                            const dirty = altIsDirty(alt);
                            const isSaving = savingAltId === alt.idAlternativa;
                            const isEditingThis = editingAltId === alt.idAlternativa;
                            return (
                              <li key={alt.idAlternativa} className="flex items-start gap-2 rounded-md border px-3 py-2 text-sm bg-card">
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-secondary px-1 text-xs font-semibold text-foreground">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <div className="flex-1 space-y-2">
                                  {isEditingThis ? (
                                    <>
                                      <Input
                                        value={alt.conteudo}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          setAltsEdit((prev) => prev.map((a) => a.idAlternativa === alt.idAlternativa ? { ...a, conteudo: v } : a));
                                        }}
                                        placeholder={`Conteúdo da alternativa ${String.fromCharCode(65 + idx)}`}
                                      />
                                      <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                                        <input
                                          type="checkbox"
                                          checked={Boolean(alt.correta)}
                                          onChange={(e) => {
                                            const checked = e.target.checked;
                                            setAltsEdit((prev) => prev.map((a) => a.idAlternativa === alt.idAlternativa ? { ...a, correta: checked } : a));
                                          }}
                                        />
                                        Correta
                                      </label>
                                    </>
                                  ) : (
                                    <div className="flex items-start gap-2">
                                      <span className={`${alt.correta ? 'text-green-800' : 'text-muted-foreground'}`}>{alt.conteudo}</span>
                                      {alt.correta && <span className="text-xs rounded bg-green-100 text-green-700 px-2 py-0.5">correta</span>}
                                    </div>
                                  )}
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAlternative(alt)} aria-label="Deletar alternativa">
                                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                    {isEditingThis ? (
                                      <>
                                        <Button variant="outline" size="sm" onClick={() => resetAlt(alt.idAlternativa)} disabled={!dirty || isSaving}>Reverter</Button>
                                        <Button size="sm" onClick={() => handleSaveAlternative(alt)} disabled={!dirty || isSaving}>{isSaving ? "Salvando..." : "Salvar"}</Button>
                                      </>
                                    ) : (
                                      <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditingAltId(alt.idAlternativa)}>
                                        <Pencil className="h-4 w-4" />
                                        Editar
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground">Sem alternativas cadastradas.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md border bg-background p-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Pergunta</div>
                      {exercise?.descricao ? (
                        <p className="text-sm text-foreground/90 leading-relaxed">{exercise.descricao}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Sem descrição.</p>
                      )}
                    </div>
                    {exercise?.pontuacao !== undefined && exercise?.pontuacao !== null && (
                      <div className="text-xs text-muted-foreground">Pontuação: <span className="font-medium text-foreground">{exercise.pontuacao} pts</span></div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                        <CircleDot className="h-3.5 w-3.5" />
                        <span>Alternativas</span>
                      </div>
                      {alternativas && alternativas.length > 0 ? (
                        <ul className="space-y-2">
                          {alternativas.map((alt, idx) => (
                            <li key={alt.idAlternativa} className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${alt.correta ? 'bg-green-50 border-green-200' : 'bg-card'}`}>
                              <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-xs font-semibold ${alt.correta ? 'bg-green-200 text-green-900' : 'bg-secondary text-foreground'}`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className={`${alt.correta ? 'text-green-800' : 'text-muted-foreground'}`}>{alt.conteudo}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground">Sem alternativas cadastradas.</p>
                      )}
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;
