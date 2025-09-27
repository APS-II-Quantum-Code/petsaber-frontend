import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Trail {
  id: string;
  title: string;
  description: string;
  modules: number;
  completedModules: number;
  points: number;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
  estimatedTime: string;
}

interface TrailCardProps {
  trail: Trail;
  onStart: (trailId: string) => void;
  onContinue: (trailId: string) => void;
}

const TrailCard = ({ trail, onStart, onContinue }: TrailCardProps) => {
  const progress = (trail.completedModules / trail.modules) * 100;
  const isCompleted = trail.completedModules === trail.modules;
  const isStarted = trail.completedModules > 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <Badge variant="secondary" className={getDifficultyColor(trail.difficulty)}>
              {trail.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {trail.estimatedTime}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              {trail.points} pts
            </div>
          </div>

          {isStarted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{trail.completedModules}/{trail.modules} módulos</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">{trail.modules} módulos</span>
          </div>

          <div className="pt-2">
            {isCompleted ? (
              <Button variant="success" className="w-full" disabled>
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluído
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