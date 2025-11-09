import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ConsultorAPI, ConsultorEspecieAPI, ConsultorRacaAPI } from "@/lib/api";

const LEVELS = [
  { value: "INICIANTE", label: "Iniciante" },
  { value: "INTERMEDIARIO", label: "Intermediário" },
  { value: "AVANCADO", label: "Avançado" },
];

const CreateTrail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    species: "", // stores species id as string
    breed: "",   // stores breed id as string
    level: "INICIANTE",
  });

  const [speciesList, setSpeciesList] = useState<Array<any>>([]);
  const [breedList, setBreedList] = useState<Array<any>>([]);
  const [speciesLoading, setSpeciesLoading] = useState<boolean>(false);
  const [breedsLoading, setBreedsLoading] = useState<boolean>(false);

  // Load species on mount
  useEffect(() => {
    const loadSpecies = async () => {
      setSpeciesLoading(true);
      try {
        const data = await ConsultorEspecieAPI.buscarEspecies<Array<{ id: number; nome: string }>>(token);
        setSpeciesList(data || []);
      } catch {
        // error toast handled globally
      } finally {
        setSpeciesLoading(false);
      }
    };
    loadSpecies();
  }, [token]);

  // Load breeds when species changes
  useEffect(() => {
    const loadBreeds = async () => {
      if (!formData.species) {
        setBreedList([]);
        setFormData((prev) => ({ ...prev, breed: "" }));
        return;
      }
      setBreedsLoading(true);
      try {
        const data = await ConsultorRacaAPI.buscarRacasPorEspecie<Array<{ id: number; nome: string }>>(Number(formData.species), token);
        setBreedList(data || []);
      } catch {
        // error toast handled globally
      } finally {
        setBreedsLoading(false);
      }
    };
    loadBreeds();
  }, [formData.species, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.species || !formData.breed) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        nome: formData.title,
        descricao: formData.description,
        nivel: formData.level,
        idRaca: Number(formData.breed),
      };
      const created = await ConsultorAPI.criarTrilha<any>(payload, token);
      const newId = created?.idTrilha ?? created?.id ?? created?.trilhaId;
      toast({ title: "Trilha criada!", description: "Redirecionando para os detalhes da trilha" });
      navigate(`/consultor/trilhas/${newId}`);
    } catch (err) {
      // apiFetch já exibe toast de erro
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
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Criar Nova Trilha</h1>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Informações da Trilha</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Trilha *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Cuidados com Golden Retriever"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Nível *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((lv) => (
                        <SelectItem key={lv.value} value={lv.value}>
                          {lv.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objetivo e conteúdo da trilha"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="species">Espécie *</Label>
                    <Select
                      value={formData.species}
                      onValueChange={(value) => setFormData({ ...formData, species: value, breed: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a espécie" />
                      </SelectTrigger>
                      <SelectContent>
                        {speciesLoading ? (
                          <SelectItem value="__loading" disabled>
                            Carregando espécies…
                          </SelectItem>
                        ) : speciesList.length === 0 ? (
                          <SelectItem value="__empty" disabled>
                            Nenhuma espécie encontrada
                          </SelectItem>
                        ) : (
                          speciesList.map((s) => {
                            const id = s.id ?? s.idEspecie ?? s.id_especie;
                            const nome = s.nome ?? s.descricao ?? String(id);
                            return (
                              <SelectItem key={String(id)} value={String(id)}>
                                {nome}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Raça *</Label>
                    <Select
                      value={formData.breed}
                      onValueChange={(value) => setFormData({ ...formData, breed: value })}
                      disabled={!formData.species}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a raça" />
                      </SelectTrigger>
                      <SelectContent>
                        {breedsLoading ? (
                          <SelectItem value="__loading" disabled>
                            Carregando raças…
                          </SelectItem>
                        ) : !formData.species ? (
                          <SelectItem value="__select_species" disabled>
                            Selecione uma espécie primeiro
                          </SelectItem>
                        ) : breedList.length === 0 ? (
                          <SelectItem value="__empty" disabled>
                            Nenhuma raça encontrada
                          </SelectItem>
                        ) : (
                          breedList.map((b) => {
                            const id = b.id ?? b.idRaca ?? b.id_raca;
                            const nome = b.nome ?? b.descricao ?? String(id);
                            return (
                              <SelectItem key={String(id)} value={String(id)}>
                                {nome}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/consultor")}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <Plus className="h-4 w-4" />
                    Criar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTrail;