import { Heart, User, BookOpen, Trophy, Settings, LogOut, UserCircle, Info } from "lucide-react";
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

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={petSaberLogo} alt="Pet Saber" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">Pet Saber</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="sm" className="gap-2"
            onClick={() => {
              const petsSection = document.getElementById('meus-pets');
              if (petsSection) {
                petsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <Heart className="h-4 w-4" />
            Meus Pets
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate("/trails")}
          >
            <BookOpen className="h-4 w-4" />
            Trilhas
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Trophy className="h-4 w-4" />
            1.250 pts
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
                Editar Perfil do tutor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/edit-pet/1")}>
                <Heart className="mr-2 h-4 w-4" />
                Editar Perfil do pet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/account-info")}>
                <Info className="mr-2 h-4 w-4" />
                Informações da conta
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