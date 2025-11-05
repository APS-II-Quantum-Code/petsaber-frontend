import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Pencil, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ConsultorAPI, ConsultorEspecieAPI, ConsultorRacaAPI } from "@/lib/api";

const LEVELS = [
  { value: "INICIANTE", label: "Iniciante" },
  { value: "INTERMEDIARIO", label: "Intermediário" },
  { value: "AVANCADO", label: "Avançado" },
];

type TrailDetails = {
  idTrilha: number;
  nome: string;
  descricao: string;
  nivel: string;
  horasTotais: number;
  modulosTotais: number;
};

type ModuleItem = { idModulo: number; nome: string; descricao?: string; duracaoHoras?: number };

const EditTrail = () => {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "", nivel: "INICIANTE" });
  const [species, setSpecies] = useState<Array<{ id: number; nome: string }>>([]);
  const [breeds, setBreeds] = useState<Array<{ id: number; nome: string }>>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<number | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!trailId) return;
      setLoading(true);
      setLoadingModules(true);
      try {
        const [det, mods] = await Promise.all([
          ConsultorAPI.trilhaDetalhes<TrailDetails>(trailId, token),
          ConsultorAPI.trilhaModulos<ModuleItem[]>(trailId, token),
        ]);
        setForm({
          nome: det?.nome ?? "",
          descricao: det?.descricao ?? "",
          nivel: det?.nivel ?? "INICIANTE",
        });
        setModules(mods ?? []);
      } finally {
        setLoading(false);
        setLoadingModules(false);
      }
    };
    load();
  }, [trailId, token]);

  // Load species on mount
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const data = await ConsultorEspecieAPI.buscarEspecies<Array<{ id: number; nome: string }>>(token);
        setSpecies(data || []);
      } catch {
        // toast handled globally in apiFetch
      }
    };
    fetchSpecies();
  }, [token]);

  // Load breeds when species changes
  useEffect(() => {
    const fetchBreeds = async () => {
      if (!selectedSpecies) {
        setBreeds([]);
        setSelectedBreed(null);
        return;
      }
      try {
        const data = await ConsultorRacaAPI.buscarRacasPorEspecie<Array<{ id: number; nome: string }>>(selectedSpecies, token);
        setBreeds(data || []);
      } catch {
        // toast handled globally in apiFetch
      }
    };
    fetchBreeds();
  }, [selectedSpecies, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trailId) return;
    setSaving(true);
    try {
      await ConsultorAPI.atualizarTrilha<void>(trailId, {
        nome: form.nome,
        descricao: form.descricao,
        nivel: form.nivel,
        idRaca: Number(selectedBreed),
      }, token);
      navigate(`/consultor/trilhas/${trailId}`);
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
            <Link to="/consultor">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Editar Trilha</h1>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{loading ? "Carregando…" : form.nome || "(sem título)"}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-muted-foreground">Carregando dados…</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da trilha</Label>
                    <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea id="descricao" rows={4} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Espécie</Label>
                      <Select
                        value={selectedSpecies ? String(selectedSpecies) : ""}
                        onValueChange={(v) => setSelectedSpecies(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a espécie" />
                        </SelectTrigger>
                        <SelectContent>
                          {species.map((s: any) => {
                            const id = s.id ?? s.idEspecie ?? s.id_especie;
                            const nome = s.nome ?? s.descricao ?? String(id);
                            return (
                              <SelectItem key={String(id)} value={String(id)}>
                                {nome}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Raça disponível</Label>
                      <Select
                        value={selectedBreed ? String(selectedBreed) : ""}
                        onValueChange={(v) => setSelectedBreed(Number(v))}
                        disabled={!selectedSpecies}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a raça" />
                        </SelectTrigger>
                        <SelectContent>
                          {breeds.map((b: any) => {
                            const id = b.id ?? b.idRaca ?? b.id_raca;
                            const nome = b.nome ?? b.descricao ?? String(id);
                            return (
                              <SelectItem key={String(id)} value={String(id)}>
                                {nome}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nível</Label>
                      <Select value={form.nivel} onValueChange={(v) => setForm({ ...form, nivel: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEVELS.map((lv) => (
                            <SelectItem key={lv.value} value={lv.value}>{lv.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
                    <Button type="submit" disabled={saving} className="gap-2">
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card mt-6">
            <CardHeader>
              <CardTitle>Módulos vinculados</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingModules ? (
                <div className="text-muted-foreground">Carregando módulos…</div>
              ) : modules.length === 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nenhum módulo cadastrado.</span>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(`/admin/create-module/${trailId}`)}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:inline">Novo Módulo</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(`/admin/create-module/${trailId}`)}>
                      <Plus className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only sm:inline">Novo Módulo</span>
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {modules.map((m) => (
                      <li key={m.idModulo} className="rounded-md border p-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{m.nome}</div>
                          {m.descricao && <div className="text-sm text-muted-foreground">{m.descricao}</div>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-muted-foreground hover:text-foreground"
                            onClick={() => navigate(`/admin/create-content/${trailId}/${m.idModulo}`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:inline">Editar conteúdo</span>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
;
export default EditTrail;
