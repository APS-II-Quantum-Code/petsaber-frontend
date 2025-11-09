import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Save, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ConsultorAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ModuloDetalhes {
  idModulo: number;
  nome: string;
  descricao?: string;
  duracaoHoras?: number;
  conteudo?: string;
}

const EditModule = () => {
  const { trailId, moduleId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracaoHoras, setDuracaoHoras] = useState<string>("");
  const [conteudo, setConteudo] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!moduleId) return;
      setLoading(true);
      setError(null);
      try {
        const det = await ConsultorAPI.moduloDetalhes<ModuloDetalhes>(moduleId, token);
        if (det) {
          setNome(det.nome || "");
          setDescricao(det.descricao || "");
          setDuracaoHoras(det.duracaoHoras != null ? String(det.duracaoHoras) : "");
          setConteudo(det.conteudo || "");
        }
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar módulo");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [moduleId, token]);

  const handleSave = async () => {
    if (!moduleId) return;
    if (!nome.trim()) {
      toast({ title: "Validação", description: "O nome do módulo é obrigatório", variant: "destructive" });
      return;
    }
    const dur = duracaoHoras.trim() ? parseInt(duracaoHoras, 10) : undefined;
    const isInt = duracaoHoras.trim() === "" ? true : /^\d+$/.test(duracaoHoras.trim());
    if (!isInt || (dur !== undefined && dur < 0)) {
      toast({ title: "Validação", description: "Duração deve ser um número inteiro válido (0 ou maior)", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await ConsultorAPI.atualizarModulo<void>(
        moduleId,
        { nome: nome.trim(), descricao: descricao.trim(), duracaoHoras: dur, conteudo: conteudo },
        token
      );
      toast({ title: "Sucesso", description: "Módulo atualizado com sucesso" });
      navigate(`/admin/module/${trailId}/${moduleId}`);
    } catch {
      // toasts já tratados em apiFetch
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
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Editar Módulo</h1>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Informações do Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Carregando…</p>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Comandos básicos" />
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <Label htmlFor="duracao">Duração (horas)</Label>
                    <Input id="duracao" type="number" min={0} step={1} value={duracaoHoras} onChange={(e) => setDuracaoHoras(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Resumo sobre o módulo" rows={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conteudo">Conteúdo</Label>
                    <Textarea
                      id="conteudo"
                      value={conteudo}
                      onChange={(e) => setConteudo(e.target.value)}
                      placeholder="Conteúdo detalhado do módulo (suporta múltiplas linhas)"
                      rows={14}
                      className="min-h-64"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/module/${trailId}/${moduleId}`)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                      <Save className="h-4 w-4" />
                      Salvar alterações
                    </Button>
                  </div>
                </div>
              )}
              {error && <p className="text-destructive text-sm mt-3">{error}</p>}
            </CardContent>
          </Card>

          <div className="mt-4 text-xs text-muted-foreground">
            Dica: para editar conteúdo/quiz deste módulo, use a tela específica de conteúdo.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModule;
