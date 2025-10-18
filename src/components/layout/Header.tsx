import { Heart, User, Trophy, Settings, LogOut, UserCircle, PawPrint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import petSaberLogo from "@/assets/pet-saber-logo.png";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { TutorAPI } from "@/lib/api";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  const [pontosTotais, setPontosTotais] = useState<number | null>(null);
  const [loadingPts, setLoadingPts] = useState(true);
  const numberFmt = new Intl.NumberFormat("pt-BR");

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const resp = await TutorAPI.meuProgresso<{ pontosTotais: number }>(token);
        if (mounted) setPontosTotais(resp?.pontosTotais ?? 0);
      } catch (e) {
        if (mounted) setPontosTotais(0);
      } finally {
        if (mounted) setLoadingPts(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/me" className="flex items-center gap-3">
          <img src={petSaberLogo} alt="Pet Saber" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">Pet Saber</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="sm" className="gap-2">
            <Trophy className="h-4 w-4" />
            {loadingPts ? "—" : `${numberFmt.format(pontosTotais ?? 0)} pts`}
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <DropdownMenu>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm font-medium">{user?.nome}</span> 
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                <UserCircle className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/tutor#meus-pets") }>
                <Heart className="mr-2 h-4 w-4" />
                Meus Pets
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Fazer logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;