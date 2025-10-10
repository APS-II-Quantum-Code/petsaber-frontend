import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "@/components/layout/Header.tsx";
import WelcomeCard from "@/components/dashboard/WelcomeCard.tsx";
import StatsCard from "@/components/dashboard/StatsCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import PetCard from "@/components/pets/PetCard.tsx";
import TrailCard from "@/components/learning/TrailCard.tsx";
import {PetAPI, TutorAPI} from "@/lib/api";
import {useAuth} from "@/context/AuthContext";
import {toast} from "@/hooks/use-toast";

const TutorDashboard = () => {
    const {token} = useAuth();

    // Pets from backend
    type Pet = {
        idPet: number;
        nome: string;
        especie: {
            idEspecie: number;
            nome: string;
        };
        raca: {
            idRaca: number;
            nome: string;
        };
        dataNascimento: string;
        idade: number;
        porte: {
            idPorte: number;
            nome: string;
            descricao: string;
        };
        sexo: string;
        urlImagem: string | null;
    };

    const [pets, setPets] = useState<Pet[]>([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const loadPets = async () => {
        setLoadingPets(true);
        try {
            const resp = await TutorAPI.buscarPets<Pet[]>(token);
            setPets(resp);
        } catch (e) {
            console.error("Erro ao carregar pets:", e);
            setPets([]);
        } finally {
            setLoadingPets(false);
        }
    };

    useEffect(() => {
        loadPets();
    }, [token]);

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


    const handleEditPet = (pet: unknown) => {
        console.log("Editar pet:", pet);
    };

    const handleDeletePet = async (petId: string) => {
        try {
            await PetAPI.deletarPet<void>(petId, token);
            setPets((prevPets) => prevPets.filter((pet) => pet.idPet !== Number(petId)));
            toast({ title: "Pet removido", description: "O pet foi excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir pet:", error);
        }
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
    };

    return (
        <div className="min-h-screen bg-gradient-soft">
            <Header/>

            <main className="container py-8 space-y-8">
                <WelcomeCard/>

                <StatsCard/>

                {/* Meus Pets Section */}
                <section id="meus-pets">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Meus Pets</h2>
                        <Button onClick={handleAddPet} variant="default" className="gap-2">
                            <Plus className="h-4 w-4"/>
                            Adicionar Pet
                        </Button>
                    </div>

                    {loadingPets ? (
                        <div className="text-muted-foreground">Carregando pets…</div>
                    ) : pets.length === 0 ? (
                        <div className="text-muted-foreground">Você ainda não cadastrou nenhum pet.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <PetCard
                                    key={pet.idPet}
                                    pet={pet}
                                    onEdit={handleEditPet}
                                    onDelete={handleDeletePet}
                                />
                            ))}
                        </div>
                    )}
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

export default TutorDashboard;
