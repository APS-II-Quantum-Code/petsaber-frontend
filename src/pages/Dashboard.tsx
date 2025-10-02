import Header from "@/components/layout/Header";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatsCard from "@/components/dashboard/StatsCard";
import PetCard from "@/components/pets/PetCard";
import TrailCard from "@/components/learning/TrailCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data
const mockPets = [
  {
    id: "1",
    name: "Thor",
    species: "Cão",
    breed: "Golden Retriever",
    birthDate: "2020-03-15",
    size: "Grande",
    gender: "Macho"
  },
  {
    id: "2",
    name: "Luna",
    species: "Gato",
    breed: "Persa",
    birthDate: "2021-07-20",
    size: "Pequeno",
    gender: "Fêmea"
  },
  {
    id: "3",
    name: "Rex",
    species: "Cão",
    breed: "Pastor Alemão",
    birthDate: "2019-11-10",
    size: "Grande",
    gender: "Macho"
  }
];

const mockTrails = [
  {
    id: "1",
    title: "Cuidados Básicos para Cães",
    description: "Aprenda os fundamentos essenciais para cuidar do seu cão com amor e responsabilidade.",
    modules: 3,
    completedModules: 2,
    points: 300,
    difficulty: "Básico" as const,
    estimatedTime: "2h"
  },
  {
    id: "2",
    title: "Nutrição Felina Avançada",
    description: "Domine os conceitos de alimentação balanceada e necessidades nutricionais dos gatos.",
    modules: 3,
    completedModules: 3,
    points: 450,
    difficulty: "Intermediário" as const,
    estimatedTime: "3h"
  },
  {
    id: "3",
    title: "Primeiros Socorros para Pets",
    description: "Saiba como agir em emergências e prestar primeiros socorros aos seus pets.",
    modules: 3,
    completedModules: 0,
    points: 500,
    difficulty: "Avançado" as const,
    estimatedTime: "4h"
  }
];

const Dashboard = () => {
  const handleEditPet = (pet: unknown) => {
    console.log("Editar pet:", pet);
  };

  const handleDeletePet = (petId: string) => {
    console.log("Excluir pet:", petId);
  };

  const handleStartTrail = (trailId: string) => {
    console.log("Iniciar trilha:", trailId);
  };

  const handleContinueTrail = (trailId: string) => {
    console.log("Continuar trilha:", trailId);
  };
  
  const navigate = useNavigate(); // Hook para navegação

  const handleAddPet = () => {
    navigate("/add-pet"); //  Redireciona para a tela de cadastro de pet
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="container py-8 space-y-8">
        <WelcomeCard />
        
        <StatsCard />

        {/* Meus Pets Section */}
        <section id="meus-pets">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Meus Pets</h2>
            <Button onClick={handleAddPet} variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Pet
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={handleEditPet}
                onDelete={handleDeletePet}
              />
            ))}
          </div>
        </section>

        {/* Trilhas de Aprendizado Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Trilhas de Aprendizado</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTrails.map((trail) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                onStart={handleStartTrail}
                onContinue={handleContinueTrail}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;