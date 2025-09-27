import { Edit, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  size: string;
  gender: string;
  photo?: string;
}

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (petId: string) => void;
}

const PetCard = ({ pet, onEdit, onDelete }: PetCardProps) => {
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  const getSizeColor = (size: string) => {
    switch (size.toLowerCase()) {
      case 'pequeno': return 'bg-green-100 text-green-800';
      case 'médio': return 'bg-blue-100 text-blue-800';
      case 'grande': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-card transition-all duration-200 bg-pet-card border-pet-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.species} • {pet.breed}</p>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(pet)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(pet.id)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getSizeColor(pet.size)}>
              {pet.size}
            </Badge>
            <Badge variant="outline">
              {pet.gender}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {calculateAge(pet.birthDate)} anos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;