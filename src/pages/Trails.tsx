import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";

// Mock data - trilhas baseadas nas raças dos pets
const trails = [
  {
    id: "1",
    petName: "Thor",
    breed: "Golden Retriever",
    species: "Cão",
    title: "Cuidados com Golden Retriever",
    description: "Aprenda tudo sobre os cuidados especiais para a raça Golden Retriever",
    modules: [
      { id: 1, title: "Fundamentos da Raça", level: "Básico", completed: true },
      { id: 2, title: "Nutrição e Exercícios", level: "Intermediário", completed: false },
      { id: 3, title: "Saúde e Bem-estar", level: "Avançado", completed: false },
    ],
    completedModules: 1,
    totalModules: 3,
  },
  {
    id: "2",
    petName: "Luna",
    breed: "Persa",
    species: "Gato",
    title: "Cuidados com Gato Persa",
    description: "Entenda as necessidades específicas dos gatos da raça Persa",
    modules: [
      { id: 1, title: "Características da Raça", level: "Básico", completed: true },
      { id: 2, title: "Higiene e Pelagem", level: "Intermediário", completed: true },
      { id: 3, title: "Prevenção de Doenças", level: "Avançado", completed: true },
    ],
    completedModules: 3,
    totalModules: 3,
  },
];

const Trails = () => {
  const navigate = useNavigate();
  
  const getProgressPercentage = (completed: number, total: number) => {
    return (completed / total) * 100;
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
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/me">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Trilhas de Aprendizado</h1>
          </div>

          <p className="text-muted-foreground mb-8">
            Explore as trilhas personalizadas para cada um dos seus pets
          </p>

          <div className="grid gap-6">
            {trails.map((trail) => (
              <Card key={trail.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{trail.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Para: <span className="font-medium text-foreground">{trail.petName}</span> ({trail.breed})
                      </p>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      {trail.totalModules} módulos
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{trail.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">
                        {trail.completedModules} de {trail.totalModules} módulos
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(trail.completedModules, trail.totalModules)} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Módulos:</h4>
                    <div className="space-y-2">
                      {trail.modules.map((module) => (
                        <div
                          key={module.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${module.completed ? 'bg-primary' : 'bg-muted'}`} />
                            <span className="font-medium text-sm">{module.title}</span>
                            <Badge variant="outline" className={getLevelColor(module.level)}>
                              {module.level}
                            </Badge>
                          </div>
                          {module.completed && (
                            <Award className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/trail/${trail.id}`)}
                  >
                    {trail.completedModules === trail.totalModules ? "Revisar Trilha" : "Continuar Trilha"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trails;