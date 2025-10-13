import { BookOpen, CheckCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface TrailProgressCardData {
  id: string;
  trailId: string;
  progressId?: string | null;
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
  onStart: (trail: TrailProgressCardData) => void;
  onContinue: (trail: TrailProgressCardData) => void;
  variant?: "my" | "available"; // controla estilização/CTA
}

const TrailCard = ({ trail, onStart, onContinue, variant = "my" }: TrailCardProps) => {
  const progress = trail.totalModules > 0 ? (trail.completedModules / trail.totalModules) * 100 : 0;
  // Determinar concluída/iniciada baseado em números ao invés de strings
  const isCompleted = trail.totalModules > 0 && trail.completedModules >= trail.totalModules;
  const isStarted = trail.completedModules > 0 || !!trail.startedAt;

  // Exibir diretamente os valores tratados vindos do backend
  const difficultyLabel = trail.difficulty;

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
            <Badge variant="secondary">
              {difficultyLabel}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${(() => {
                const s = (trail.status || "").toLowerCase();
                if (s.includes("conclu")) return "border-green-300 text-green-700 bg-green-50";
                if (s.includes("andament")) return "border-blue-300 text-blue-700 bg-blue-50";
                if (s.includes("não") || s.includes("nao") || s.includes("inic")) return "border-gray-300 text-gray-700 bg-gray-50";
                return "border-muted text-foreground";
              })()}`}
            >
              {trail.status}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {trail.totalHours}h totais
            </div>
          </div>

          {variant === "my" && trail.totalModules > 0 && (
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
            {isCompleted && variant === "my" ? (
              <Button variant="success" className="w-full" disabled>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluída
              </Button>
            ) : variant === "available" ? (
              <Button
                variant="hero"
                className="w-full"
                onClick={() => onStart(trail)}
              >
                Iniciar Trilha
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={() => onContinue(trail)}
              >
                Continuar Trilha
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrailCard;