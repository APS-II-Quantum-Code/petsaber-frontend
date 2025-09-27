import { Heart, BookOpen, Trophy, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color?: string;
}

const StatItem = ({ icon, value, label, color = "text-primary" }: StatItemProps) => (
  <div className="text-center">
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3 ${color}`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const StatsCard = () => {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Seu Progresso</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem
            icon={<Heart className="h-6 w-6" />}
            value="3"
            label="Pets Cadastrados"
          />
          <StatItem
            icon={<BookOpen className="h-6 w-6" />}
            value="2/5"
            label="Trilhas Concluídas"
          />
          <StatItem
            icon={<Trophy className="h-6 w-6" />}
            value="1.250"
            label="Pontos Totais"
          />
          <StatItem
            icon={<Award className="h-6 w-6" />}
            value="8"
            label="Módulos Completos"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;