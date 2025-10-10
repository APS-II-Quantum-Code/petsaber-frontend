import { BookOpen, CheckCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface TrailProgressCardData {
  id: string;
  title: string;
  description: string;
  totalModules: number;
  completedModules: number;
  totalHours: number;
  difficulty: string;
  status: string;
  startedAt?: string | null;
  finishedAt?: string | null;
}

interface TrailCardProps {
  trail: TrailProgressCardData;
  onStart: (trailId: string) => void;
  onContinue: (trailId: string) => void;
}

const TrailCard = ({ trail, onStart, onContinue }: TrailCardProps) => {
  const progress = trail.totalModules > 0 ? (trail.completedModules / trail.totalModules) * 100 : 0;
  const isCompleted = trail.status === "CONCLUIDA";
  const isStarted = !isCompleted && trail.status !== "NAO_INICIADA";

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "básico":
      case "basico":
        return "bg-green-100 text-green-800";
      case "intermediário":
      case "intermediario":
        return "bg-yellow-100 text-yellow-800";
      case "avançado":
      case "avancado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDifficulty = (level: string) => {
    const mapping: Record<string, string> = {
      INICIANTE: "Básico",
      INTERMEDIARIO: "Intermediário",
      INTERMEDIÁRIO: "Intermediário",
      AVANÇADO: "Avançado",
      AVANCADO: "Avançado",
    };
    return mapping[level] || level;
  };

  const formatStatus = (status: string) => {
    const mapping: Record<string, string> = {
      NAO_INICIADA: "Não iniciada",
      EM_ANDAMENTO: "Em andamento",
      CONCLUIDA: "Concluída",
    };
    return mapping[status] || status;
  };

  const difficultyLabel = formatDifficulty(trail.difficulty);

  return (
    <Card className="group hover:shadow-card transition-all duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">{trail.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{trail.description}</p>
            </div>
            {isCompleted && (
              <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={getDifficultyColor(difficultyLabel)}>
              {difficultyLabel}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatStatus(trail.status)}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {trail.totalHours}h totais
            </div>
          </div>

          {trail.totalModules > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{trail.completedModules}/{trail.totalModules} módulos</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">{trail.totalModules} módulos</span>
          </div>

          <div className="pt-2">
            {isCompleted ? (
              <Button variant="success" className="w-full" disabled>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluída
              </Button>
            ) : isStarted ? (
              <Button
                variant="default"
                className="w-full"
                onClick={() => onContinue(trail.id)}
              >
                Continuar Trilha
              </Button>
            ) : (
              <Button
                variant="hero"
                className="w-full"
                onClick={() => onStart(trail.id)}
              >
                Iniciar Trilha
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrailCard;