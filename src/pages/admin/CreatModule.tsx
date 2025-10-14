import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  title: string;
  level: string;
}

const CreateModule = () => {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState({
    title: "",
    level: "",
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Básico":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Intermediário":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Avançado":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      default:
        return "bg-muted";
    }
  };

  const handleAddModule = () => {
    if (!currentModule.title || !currentModule.level) {
      toast({
        title: "Erro",
        description: "Preencha o título e nível do módulo",
        variant: "destructive",
      });
      return;
    }

    const newModule: Module = {
      id: Math.random().toString(36).substring(7),
      title: currentModule.title,
      level: currentModule.level,
    };

    setModules([...modules, newModule]);
    setCurrentModule({ title: "", level: "" });
    
    toast({
      title: "Módulo adicionado!",
      description: "Continue adicionando mais módulos ou finalize",
    });
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleFinish = () => {
    if (modules.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um módulo",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Módulos criados!",
      description: "Agora você pode adicionar conteúdo ao primeiro módulo",
    });

    // Redireciona para criação de conteúdo do primeiro módulo
    navigate(`/admin/create-content/${trailId}/${modules[0].id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/admin/create-trail">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Adicionar Módulos</h1>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Formulário para adicionar novo módulo */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Novo Módulo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="moduleTitle">Título do Módulo</Label>
                      <Input
                        id="moduleTitle"
                        placeholder="Ex: Fundamentos da Raça"
                        value={currentModule.title}
                        onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="moduleLevel">Nível</Label>
                      <Select
                        value={currentModule.level}
                        onValueChange={(value) => setCurrentModule({ ...currentModule, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermediário">Intermediário</SelectItem>
                          <SelectItem value="Avançado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleAddModule} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Módulo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de módulos adicionados */}
            {modules.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Módulos Adicionados ({modules.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{module.title}</p>
                            <Badge variant="outline" className={`mt-1 ${getLevelColor(module.level)}`}>
                              {module.level}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveModule(module.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleFinish} className="w-full mt-6 gap-2">
                    Finalizar e Adicionar Conteúdo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModule;