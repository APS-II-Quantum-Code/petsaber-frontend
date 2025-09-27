import { Plus, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroPets from "@/assets/hero-pets.jpg";

const WelcomeCard = () => {
  return (
    <Card className="overflow-hidden shadow-card">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Bem-vindo ao Pet Saber! 🐾
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Aprenda tudo sobre cuidados com pets e ganhe pontos completando trilhas educativas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/add-pet">
                <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                  <Plus className="h-5 w-5" />
                  Cadastrar Pet
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Heart className="h-5 w-5" />
                Ver Trilhas
              </Button>
            </div>
          </div>
          <div className="flex-1 relative min-h-[200px] md:min-h-[300px]">
            <img
              src={heroPets}
              alt="Tutores felizes com seus pets"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;