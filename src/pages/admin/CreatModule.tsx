import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ConsultorAPI } from "@/lib/api";

const CreateModule = () => {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracaoHoras, setDuracaoHoras] = useState<string>("");
  const [conteudo, setConteudo] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
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
    if (!trailId) {
      toast({ title: "Erro", description: "ID da trilha inválido", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const created: any = await ConsultorAPI.criarModulo<any>(trailId, { nome: nome.trim(), descricao: descricao.trim(), duracaoHoras: dur, conteudo }, token);
      const newId = created?.idModulo ?? created?.id ?? created?.id_modulo ?? created?.data?.idModulo;
      toast({ title: "Módulo criado", description: "Redirecionando para os detalhes do módulo" });
      if (newId) {
        navigate(`/admin/module/${trailId}/${newId}`);
      } else {
        // fallback: voltar para detalhes da trilha
        navigate(`/consultor/trilhas/${trailId}`);
      }
    } catch (e) {
      // apiFetch já exibe toast de erro
    } finally {
      setSaving(false);
    }
  };

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
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Adicionar Módulo</h1>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Novo Módulo</CardTitle>
              </CardHeader>
              <CardContent>
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
                    <Button variant="outline" onClick={() => navigate(`/consultor/trilhas/${trailId}`)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="gap-2" disabled={saving}>
                      <Save className="h-4 w-4" />
                      {saving ? "Salvando..." : "Criar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModule;