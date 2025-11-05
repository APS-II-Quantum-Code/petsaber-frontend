import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Layers, Clock, PawPrint } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ConsultorAPI } from "@/lib/api";

type TrailDetails = {
  idTrilha: number;
  nome: string;
  descricao: string;
  nivel: string;
  horasTotais: number;
  modulosTotais: number;
  // optional breed fields depending on backend shape
  idRaca?: number;
  racaNome?: string;
  nomeRaca?: string;
  raca?: { id?: number; idRaca?: number; nome?: string };
};

type ModuleItem = { idModulo: number; nome: string; descricao?: string; duracaoHoras?: number };

const ConsultantTrailDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [details, setDetails] = useState<TrailDetails | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [det, mods] = await Promise.all([
          ConsultorAPI.trilhaDetalhes<TrailDetails>(id, token),
          ConsultorAPI.trilhaModulos<ModuleItem[]>(id, token),
        ]);
        setDetails(det ?? null);
        setModules(mods ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  const handleDelete = async () => {
    if (!id || !details) return;
    const ok = window.confirm(`Deseja realmente deletar a trilha "${details.nome}"?`);
    if (!ok) return;
    try {
      await ConsultorAPI.deletarTrilha<void>(id, token);
      navigate("/consultor");
    } catch {
      // apiFetch mostra toast de erro
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="container py-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/consultor")}> 
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">
              {loading ? "Carregando…" : details?.nome ?? "Trilha"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-muted-foreground">Carregando detalhes…</div>
            ) : !details ? (
              <div className="text-muted-foreground">Não foi possível carregar a trilha.</div>
            ) : (
              <>
                  <div className="text-sm text-muted-foreground">{details.descricao}</div>
                {/* Stats with icons */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="h-4 w-4" />
                    <span>Módulos:</span>
                    <span className="font-medium text-foreground">{details.modulosTotais ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Horas:</span>
                    <span className="font-medium text-foreground">{details.horasTotais ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="inline-flex items-center gap-2"><span className="px-2 py-0.5 rounded bg-secondary/60 text-foreground text-xs">Nível</span></span>
                    <span className="font-medium text-foreground">{details.nivel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <PawPrint className="h-4 w-4" />
                    <span>Raça:</span>
                    <span className="font-medium text-foreground">{
                      (details as any).racaNome ||
                      (details as any).nomeRaca ||
                      (typeof (details as any).raca === "string" ? (details as any).raca : (details as any).raca?.nome) ||
                      "—"
                    }</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate(`/admin/edit-trail/${details.idTrilha}`)} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Deletar
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Módulos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Carregando módulos…</div>
            ) : modules.length === 0 ? (
              <div className="text-muted-foreground">Nenhum módulo cadastrado.</div>
            ) : (
              <ul className="space-y-2">
                {modules.map((m) => (
                  <li key={m.idModulo} className="rounded-md border p-3">
                    <div className="font-medium">{m.nome}</div>
                    {m.descricao && <div className="text-sm text-muted-foreground">{m.descricao}</div>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConsultantTrailDetails;
