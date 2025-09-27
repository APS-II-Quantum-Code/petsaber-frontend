import { Heart, User, BookOpen, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import petSaberLogo from "@/assets/pet-saber-logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={petSaberLogo} alt="Pet Saber" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">Pet Saber</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="sm" className="gap-2">
            <Heart className="h-4 w-4" />
            Meus Pets
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Trilhas
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Trophy className="h-4 w-4" />
            1.250 pts
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm font-medium">João Silva</span>
        </div>
      </div>
    </header>
  );
};

export default Header;