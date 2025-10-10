import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "@/components/layout/Header.tsx";
import WelcomeCard from "@/components/dashboard/WelcomeCard.tsx";
import StatsCard from "@/components/dashboard/StatsCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import PetCard from "@/components/pets/PetCard.tsx";
import TrailCard, {TrailProgressCardData} from "@/components/learning/TrailCard.tsx";
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

    type TutorTrailProgressResponse = {
        content: Array<{
            idProgressoTrilha: number;
            dataInicio: string | null;
            dataConclusao: string | null;
            status: "NAO_INICIADA" | "EM_ANDAMENTO" | "CONCLUIDA";
            modulosConcluidos: number;
            trilha: {
                idTrilha: number;
                nome: string;
                descricao: string;
                nivel: string;
                horasTotais: number;
                modulosTotais: number;
            };
        }>;
    };

    type TutorAvailableTrailsResponse = {
        content: Array<{
            idTrilha: number;
            nome: string;
            descricao: string;
            nivel: string;
            horasTotais: number;
            modulosTotais: number;
        }>;
    };

    const [pets, setPets] = useState<Pet[]>([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const [trails, setTrails] = useState<TrailProgressCardData[]>([]);
    const [loadingTrails, setLoadingTrails] = useState(true);
    const [availableTrails, setAvailableTrails] = useState<TrailProgressCardData[]>([]);
    const [loadingAvailableTrails, setLoadingAvailableTrails] = useState(true);
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

    const loadTrails = async () => {
        setLoadingTrails(true);
        try {
            const resp = await TutorAPI.minhasTrilhas<TutorTrailProgressResponse>(token);
            const mappedTrails: TrailProgressCardData[] = (resp?.content ?? []).map((item) => ({
                id: item.idProgressoTrilha.toString(),
                title: item.trilha.nome,
                description: item.trilha.descricao,
                totalModules: item.trilha.modulosTotais,
                completedModules: item.modulosConcluidos,
                totalHours: item.trilha.horasTotais,
                difficulty: item.trilha.nivel,
                status: item.status,
                startedAt: item.dataInicio,
                finishedAt: item.dataConclusao,
            }));
            setTrails(mappedTrails);
        } catch (e) {
            console.error("Erro ao carregar trilhas:", e);
            setTrails([]);
        } finally {
            setLoadingTrails(false);
        }
    };

    const loadAvailableTrails = async () => {
        setLoadingAvailableTrails(true);
        try {
            const resp = await TutorAPI.trilhasDisponiveis<TutorAvailableTrailsResponse>(token);
            const mapped: TrailProgressCardData[] = (resp?.content ?? []).map((item) => ({
                id: item.idTrilha.toString(),
                title: item.nome,
                description: item.descricao,
                totalModules: item.modulosTotais,
                completedModules: 0,
                totalHours: item.horasTotais,
                difficulty: item.nivel,
                status: "NAO_INICIADA",
                startedAt: null,
                finishedAt: null,
            }));
            setAvailableTrails(mapped);
        } catch (e) {
            console.error("Erro ao carregar trilhas disponíveis:", e);
            setAvailableTrails([]);
        } finally {
            setLoadingAvailableTrails(false);
        }
    };

    useEffect(() => {
        loadPets();
        loadTrails();
        loadAvailableTrails();
    }, [token]);

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

                {/* Minhas Trilhas Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Minhas Trilhas</h2>
                    </div>

                    {loadingTrails ? (
                        <div className="text-muted-foreground">Carregando trilhas…</div>
                    ) : trails.length === 0 ? (
                        <div className="text-muted-foreground">Você ainda não possui trilhas iniciadas.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trails.map((trail) => (
                                <TrailCard
                                    key={trail.id}
                                    trail={trail}
                                    onStart={handleStartTrail}
                                    onContinue={handleContinueTrail}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Trilhas Disponíveis Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Trilhas Disponíveis</h2>
                    </div>

                    {loadingAvailableTrails ? (
                        <div className="text-muted-foreground">Carregando trilhas disponíveis…</div>
                    ) : availableTrails.length === 0 ? (
                        <div className="text-muted-foreground">Nenhuma trilha disponível no momento.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableTrails.map((trail) => (
                                <TrailCard
                                    key={trail.id}
                                    trail={trail}
                                    onStart={handleStartTrail}
                                    onContinue={handleContinueTrail}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default TutorDashboard;
