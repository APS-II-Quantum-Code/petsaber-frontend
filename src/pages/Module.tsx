import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { TutorAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Module = () => {
  const { trailId, moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Backend-driven state
  const { token } = useAuth();
  type ModuloDetalhes = {
    idModulo: number;
    nome: string;
    descricao: string;
    duracaoHoras: number;
    conteudo: string;
  };
  type Alternativa = { idAlternativa: number; conteudo: string };
  type Exercicio = { idExercicio: number; nome: string; descricao: string; alternativas: Alternativa[] };

  const [moduleDetails, setModuleDetails] = useState<ModuloDetalhes | null>(null);
  const [exercises, setExercises] = useState<Exercicio[]>([]);
  const [loadingModule, setLoadingModule] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [errorModule, setErrorModule] = useState<string | null>(null);
  const [errorExercises, setErrorExercises] = useState<string | null>(null);
  const [moduleStatus, setModuleStatus] = useState<string | null>(null);

  useEffect(() => {
    const id = moduleId ?? "";
    if (!token || !id) return;
    const fetchData = async () => {
      setLoadingModule(true);
      setErrorModule(null);
      try {
        const details = await TutorAPI.moduloDetalhes<ModuloDetalhes>(id, token);
        setModuleDetails(details);
      } catch (e: any) {
        setErrorModule(e?.message || "Erro ao carregar módulo");
      } finally {
        setLoadingModule(false);
      }

      setLoadingExercises(true);
      setErrorExercises(null);
      try {
        const list = await TutorAPI.exerciciosDoModulo<Exercicio[]>(id, token);
        setExercises(list ?? []);
      } catch (e: any) {
        setErrorExercises(e?.message || "Erro ao carregar exercícios");
        setExercises([]);
      } finally {
        setLoadingExercises(false);
      }

      // Busca o status de andamento do módulo
      try {
        const prog = await TutorAPI.moduloMeuProgresso<{ status: string }>(id, token);
        const status = String((prog as any)?.status || "");
        setModuleStatus(status || null);
      } catch {
        setModuleStatus(null);
      }
    };
    fetchData();
  }, [moduleId, token]);

  const getMutedBadge = () => "bg-muted text-muted-foreground border-muted";

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "NAO_INICIADO":
        return "bg-muted text-muted-foreground border-muted";
      case "EM_ANDAMENTO":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONCLUIDO":
      case "APROVADO":
        return "bg-green-50 text-green-700 border-green-200";
      case "REPROVADO":
        return "bg-red-50 text-red-700 border-red-200";
      case "PENDENTE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return getMutedBadge();
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NAO_INICIADO":
        return "Não iniciado";
      case "EM_ANDAMENTO":
        return "Em andamento";
      case "CONCLUIDO":
        return "Concluído";
      case "APROVADO":
        return "Aprovado";
      case "REPROVADO":
        return "Reprovado";
      case "PENDENTE":
        return "Pendente";
      default:
        return status || "";
    }
  };

  // Exercícios integrados ao final do módulo
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // idExercicio -> idAlternativa
  const [showResults, setShowResults] = useState(false);
  const [finalPercent, setFinalPercent] = useState<number | null>(null);
  const [finalResultError, setFinalResultError] = useState<string | null>(null);
  const totalQuestions = exercises.length;
  const progressQuiz = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;
  const currentQ = exercises[currentQuestion];
  const [correctMap, setCorrectMap] = useState<Record<number, boolean>>({}); // idExercicio -> correta?
  const [submitting, setSubmitting] = useState(false);
  const [submittedMap, setSubmittedMap] = useState<Record<number, boolean>>({}); // idExercicio -> enviado?

  const handleSelectAnswer = (altId: number) => {
    const ex = currentQ?.idExercicio;
    if (!ex || submitting) return;
    // Permite alterar a seleção antes da confirmação, se ainda não enviado
    if (submittedMap[ex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [ex]: altId }));
  };

  const handleConfirmAnswer = async () => {
    const ex = currentQ?.idExercicio;
    if (!ex || submitting) return;
    if (submittedMap[ex]) return;
    const altId = selectedAnswers[ex];
    if (altId === undefined) return;
    setSubmitting(true);
    try {
      const resp = await TutorAPI.responderExercicio<{ correta: string }>(ex, altId, token);
      const isCorrect = String((resp as any)?.correta).toLowerCase() === "true";
      setCorrectMap((prev) => ({ ...prev, [ex]: isCorrect }));
      setSubmittedMap((prev) => ({ ...prev, [ex]: true }));
      toast({
        title: isCorrect ? "Resposta correta" : "Resposta incorreta",
        description: isCorrect ? "Muito bem!" : "Revise o conteúdo e tente novamente.",
        variant: isCorrect ? "default" : "destructive",
      });
    } catch (e: any) {
      toast({ title: "Erro ao enviar resposta", description: e?.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!currentQ) return;
    // Só avança se a resposta do exercício atual já foi enviada (confirmada)
    if (!submittedMap[currentQ.idExercicio]) return;
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleFinish = async () => {
    // Apenas navega de volta; o resultado já é exibido inline na tela de resultados
    setTimeout(() => { navigate(`/trail/${trailId}`); }, 2000);
  };

  // Assim que o usuário finalizar a última questão e abrir a tela de resultados,
  // buscamos o percentual no backend e exibimos inline no mesmo box.
  useEffect(() => {
    const fetchPercent = async () => {
      try {
        const moduloId = moduleId ?? "";
        if (!showResults || !token || !moduloId) return;
        setFinalResultError(null);
        const prog = await TutorAPI.moduloMeuProgresso<{ idModulo: number; nomeModulo: string; status: string; percentualAcerto: number }>(moduloId, token);
        const pct = Number((prog as any)?.percentualAcerto ?? 0);
        setFinalPercent(pct);
      } catch (e: any) {
        setFinalResultError(e?.message || "Não foi possível obter o percentual. Tente novamente.");
      }
    };
    fetchPercent();
  }, [showResults, moduleId, token]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/trail/${trailId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{moduleDetails?.nome || (loadingModule ? "Carregando..." : "Módulo")}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {moduleStatus && (
                    <Badge variant="outline" className={getStatusBadgeColor(moduleStatus)}>
                      {getStatusLabel(moduleStatus)}
                    </Badge>
                  )}
                  {moduleDetails && (
                    <Badge variant="outline" className={getMutedBadge()}>
                      {moduleDetails.duracaoHoras}h
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Todo o conteúdo do módulo está abaixo. Role para ler tudo e, ao final, faça o exercício.</p>
            </CardHeader>
          </Card>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Conteúdo do Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none max-h-[60vh] overflow-y-auto pr-2">
                {loadingModule && <p className="text-muted-foreground">Carregando conteúdo…</p>}
                {errorModule && <p className="text-destructive">{errorModule}</p>}
                {moduleDetails && (
                  <div className="mb-8">
                    {moduleDetails.descricao && (
                      <p className="mb-3 text-sm text-muted-foreground">{moduleDetails.descricao}</p>
                    )}
                    {moduleDetails.conteudo.split('\n').map((paragraph, index) => (
                      paragraph.trim() ? (
                        <p key={index} className="mb-3 text-muted-foreground leading-relaxed">{paragraph}</p>
                      ) : (
                        <br key={index} />
                      )
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {showResults ? (
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-card text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-2">Exercícios concluídos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total de exercícios</span>
                        <span className="font-medium">{totalQuestions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Respondidos</span>
                        <span className="font-medium">{Object.keys(selectedAnswers).length}</span>
                      </div>
                    </div>
                  </>

                  <div className="pt-2">
                    {finalResultError ? (
                      <p className="text-sm text-destructive">{finalResultError}</p>
                    ) : finalPercent === null ? (
                      <p className="text-sm text-muted-foreground">Calculando seu aproveitamento…</p>
                    ) : (
                      <div className="rounded-md border p-4 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Aproveitamento</span>
                          <span className="text-base font-semibold">{finalPercent.toFixed(2)}%</span>
                        </div>
                        <div className={`mt-2 text-sm font-medium ${finalPercent > 75 ? "text-green-600" : "text-red-600"}`}>
                          {finalPercent > 75 ? "Você passou no modulo!" : "Você não passou no modulo. Tente novamente."}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 text-left">
                    {exercises.map((ex) => {
                      const isCorrect = correctMap[ex.idExercicio];
                      return (
                        <div key={ex.idExercicio} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                          )}
                          <span className="text-sm">{ex.nome}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => { setShowResults(false); setCurrentQuestion(0); setSelectedAnswers({}); }}>
                      Tentar Novamente
                    </Button>
                    <Button className="flex-1" onClick={handleFinish}>
                      Voltar para Trilha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-card mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Exercício</CardTitle>
                    <Badge variant="outline" className={getMutedBadge()}>
                      {totalQuestions} itens
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Questão {totalQuestions > 0 ? currentQuestion + 1 : 0} de {totalQuestions}</span>
                    </div>
                    <Progress value={progressQuiz} />
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">{loadingExercises ? "Carregando exercício…" : currentQ?.nome || "Sem exercícios"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {errorExercises && <p className="text-destructive">{errorExercises}</p>}
                    {!loadingExercises && currentQ?.alternativas?.map((alt) => {
                      const exId = currentQ.idExercicio;
                      const isSelected = selectedAnswers[exId] === alt.idAlternativa;
                      const hasAnswer = correctMap[exId] !== undefined;
                      const isCorrect = hasAnswer && isSelected ? correctMap[exId] : undefined;
                      const base = 'w-full p-4 rounded-lg border-2 text-left transition-all';
                      const stateClass = isSelected
                        ? (isCorrect === undefined
                            ? 'border-primary bg-primary/5'
                            : isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50')
                        : 'border-border hover:border-primary/50 hover:bg-accent/5';
                      return (
                        <button
                          key={alt.idAlternativa}
                          onClick={() => handleSelectAnswer(alt.idAlternativa)}
                          disabled={hasAnswer || submitting}
                          className={`${base} ${stateClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? isCorrect === undefined
                                  ? 'border-primary bg-primary'
                                  : isCorrect
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-red-500 bg-red-500'
                                : 'border-muted-foreground'
                            }`}>
                              {isSelected && (
                                <CheckCircle className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="font-medium">{alt.conteudo}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between gap-3">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0 || submitting}>Anterior</Button>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleConfirmAnswer}
                    disabled={!currentQ || submittedMap[currentQ.idExercicio] || selectedAnswers[currentQ.idExercicio] === undefined || submitting}
                  >
                    Confirmar Resposta
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!currentQ || !submittedMap[currentQ.idExercicio] || submitting}
                  >
                    {currentQuestion === totalQuestions - 1 ? "Finalizar" : "Próxima"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module;