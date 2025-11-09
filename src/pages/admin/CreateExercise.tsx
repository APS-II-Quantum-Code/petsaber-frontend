import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ConsultorAPI } from "@/lib/api";
import { ArrowLeft, FilePlus2 } from "lucide-react";

const CreateExercise = () => {
  const { trailId, moduleId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [pontuacao, setPontuacao] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId) {
      toast({ title: "Erro", description: "ID do módulo inválido", variant: "destructive" });
      return;
    }
    const nomeTrim = nome.trim();
    const descTrim = descricao.trim();
    if (!nomeTrim || !descTrim) {
      toast({ title: "Campos obrigatórios", description: "Informe título e pergunta do exercício.", variant: "destructive" });
      return;
    }
    const p = pontuacao.trim();
    if (p && (!/^\d+$/.test(p) || parseInt(p, 10) < 0)) {
      toast({ title: "Pontuação inválida", description: "Informe um inteiro maior ou igual a 0.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = { nome: nomeTrim, descricao: descTrim, pontuacao: p ? Number(p) : null };
      const created: any = await ConsultorAPI.criarExercicio<any>(moduleId, payload, token);
      const newId = created?.idExercicio ?? created?.id ?? created?.data?.idExercicio;
      toast({ title: "Exercício criado", description: "Redirecionando para o detalhe do exercício." });
      if (newId) {
        navigate(`/admin/exercise/${trailId}/${moduleId}/${newId}`);
      } else {
        // fallback: volta ao módulo
        navigate(`/admin/module/${trailId}/${moduleId}`);
      }
    } catch (e: any) {
      // apiFetch já deve exibir toast de erro
    } finally {
      setSaving(false);
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
              <FilePlus2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Novo Exercício</h1>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Criar exercício</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Exercício 1" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pergunta</label>
                  <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={5} placeholder="Digite a pergunta do exercício" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pontuação (opcional)</label>
                  <Input type="number" min={0} step={1} value={pontuacao} onChange={(e) => setPontuacao(e.target.value)} placeholder="Ex.: 10" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => navigate(`/admin/module/${trailId}/${moduleId}`)}>Cancelar</Button>
                  <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Criar exercício"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateExercise;
