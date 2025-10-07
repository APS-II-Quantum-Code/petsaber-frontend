import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";

const TrailDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - seria buscado baseado no ID
  const trail = {
    id: "1",
    petName: "Thor",
    breed: "Golden Retriever",
    title: "Cuidados com Golden Retriever",
    description: "Aprenda tudo sobre os cuidados especiais para a raça Golden Retriever",
    modules: [
      { 
        id: 1, 
        title: "Fundamentos da Raça", 
        level: "Básico", 
        completed: true,
        duration: "15 min",
        description: "Conheça a história, características e temperamento do Golden Retriever"
      },
      { 
        id: 2, 
        title: "Nutrição e Exercícios", 
        level: "Intermediário", 
        completed: false,
        duration: "20 min",
        description: "Aprenda sobre alimentação adequada e rotina de exercícios"
      },
      { 
        id: 3, 
        title: "Saúde e Bem-estar", 
        level: "Avançado", 
        completed: false,
        duration: "25 min",
        description: "Entenda os cuidados preventivos e problemas de saúde comuns"
      },
    ],
  };

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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/trails">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Trilhas
              </Button>
            </Link>
          </div>

          <Card className="shadow-card mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle className="text-3xl">{trail.title}</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Para: <span className="font-medium text-foreground">{trail.petName}</span> ({trail.breed})
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{trail.description}</p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Módulos da Trilha</h2>
          
          <div className="grid gap-4">
            {trail.modules.map((module) => (
              <Card 
                key={module.id} 
                className={`shadow-card hover:shadow-lg transition-all ${
                  module.completed ? 'border-primary/30' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{module.title}</h3>
                        <Badge variant="outline" className={getLevelColor(module.level)}>
                          {module.level}
                        </Badge>
                        {module.completed && (
                          <Badge className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Concluído
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{module.description}</p>
                      <p className="text-sm text-muted-foreground">⏱️ Duração: {module.duration}</p>
                    </div>
                    <Button
                      onClick={() => navigate(`/module/${trail.id}/${module.id}`)}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {module.completed ? "Revisar" : "Iniciar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailDetails;