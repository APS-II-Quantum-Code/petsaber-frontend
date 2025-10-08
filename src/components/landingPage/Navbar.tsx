import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import petSaberLogo from "@/assets/pet-saber-logo.png";

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={petSaberLogo} alt="Pet Saber" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground">Pet Saber</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="default" size="sm">Entrar</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
