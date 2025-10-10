import { useEffect, useState } from "react";
import { Heart, BookOpen, Trophy, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TutorAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
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

type TutorProgress = {
  qtdPets: number;
  qtdTrilhasConcluidas: number;
  pontosTotais: number;
  qtdModulosConcluidos: number;
};

const numberFmt = new Intl.NumberFormat("pt-BR");

const StatsCard = () => {
  const { token } = useAuth();
  const [data, setData] = useState<TutorProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const resp = await TutorAPI.meuProgresso<TutorProgress>(token);
        if (mounted) setData(resp);
      } catch (e) {
        if (mounted) setData({ qtdPets: 0, qtdTrilhasConcluidas: 0, pontosTotais: 0, qtdModulosConcluidos: 0 });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  const stats = data ?? { qtdPets: 0, qtdTrilhasConcluidas: 0, pontosTotais: 0, qtdModulosConcluidos: 0 };

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Seu Progresso</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem
            icon={<Heart className="h-6 w-6" />}
            value={loading ? "—" : stats.qtdPets}
            label="Pets Cadastrados"
          />
          <StatItem
            icon={<BookOpen className="h-6 w-6" />}
            value={loading ? "—" : stats.qtdTrilhasConcluidas}
            label="Trilhas Concluídas"
          />
          <StatItem
            icon={<Trophy className="h-6 w-6" />}
            value={loading ? "—" : numberFmt.format(stats.pontosTotais)}
            label="Pontos Totais"
          />
          <StatItem
            icon={<Award className="h-6 w-6" />}
            value={loading ? "—" : stats.qtdModulosConcluidos}
            label="Módulos Completos"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;