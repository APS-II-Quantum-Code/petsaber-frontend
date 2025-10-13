import { useState } from "react";
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

const CreateTrail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    species: "",
    breed: "",
  });

  const breeds = {
    Cão: ["Golden Retriever", "Shih Tzu"],
    Gato: ["Persa", "Maine Coon"],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.species || !formData.breed) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Mock: gerar ID da trilha criada
    const trailId = Math.random().toString(36).substring(7);
    
    toast({
      title: "Trilha criada!",
      description: "Agora você pode adicionar módulos à trilha",
    });

    // Redireciona para criação de módulos
    navigate(`/admin/create-module/${trailId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
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
                        <SelectItem value="Cão">Cão</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
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
                        {formData.species &&
                          breeds[formData.species as keyof typeof breeds]?.map((breed) => (
                            <SelectItem key={breed} value={breed}>
                              {breed}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <Plus className="h-4 w-4" />
                    Criar e Adicionar Módulos
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