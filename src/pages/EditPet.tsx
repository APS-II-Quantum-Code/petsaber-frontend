import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    birthDate: "",
    size: "",
    gender: "",
  });

  useEffect(() => {
    // Aqui seria a lógica para buscar os dados do pet pelo ID quando conectar com backend
    // Por enquanto, vamos usar dados mockados
    const mockPetData = {
      name: "Thor",
      species: "dog",
      breed: "Golden Retriever",
      birthDate: "2020-03-15",
      size: "large",
      gender: "male",
    };
    setFormData(mockPetData);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a lógica de atualização do pet quando conectar com backend
    console.log("Updated pet data:", formData);
    
    toast({
      title: "Pet atualizado!",
      description: "As informações do pet foram atualizadas com sucesso.",
    });
    
    // Redireciona para o dashboard após 1 segundo
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Editar Pet</h1>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="h-5 w-5 text-primary" />
                Informações do Pet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Pet *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ex: Buddy, Luna, Max..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="species">Espécie *</Label>
                    <Select 
                      value={formData.species} 
                      onValueChange={(value) => setFormData({ ...formData, species: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a espécie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Cão</SelectItem>
                        <SelectItem value="cat">Gato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">Raça</Label>
                    <Input
                      id="breed"
                      type="text"
                      placeholder="Ex: Golden Retriever, Persa..."
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="birthDate"
                        type="date"
                        className="pl-10"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Porte *</Label>
                    <Select 
                      value={formData.size} 
                      onValueChange={(value) => setFormData({ ...formData, size: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeno (até 10kg)</SelectItem>
                        <SelectItem value="medium">Médio (10-25kg)</SelectItem>
                        <SelectItem value="large">Grande (25-45kg)</SelectItem>
                        <SelectItem value="giant">Gigante (acima de 45kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexo *</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Macho</SelectItem>
                        <SelectItem value="female">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1" size="lg">
                    Salvar Alterações
                  </Button>
                  <Link to="/" className="flex-1">
                    <Button variant="outline" className="w-full" size="lg">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditPet;
