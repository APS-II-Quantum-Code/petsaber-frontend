import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "@/components/layout/Header.tsx";
import WelcomeCard from "@/components/dashboard/WelcomeCard.tsx";
import StatsCard from "@/components/dashboard/StatsCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, Trophy} from "lucide-react";
import PetCard from "@/components/pets/PetCard.tsx";
import TrailCard, {TrailProgressCardData} from "@/components/learning/TrailCard.tsx";
import {PetAPI, TutorAPI} from "@/lib/api";
import {useAuth} from "@/context/AuthContext";
import {toast} from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TutorDashboard = () => {
    const {token, user} = useAuth();

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

    type TutorRankingResponse = {
        content: Array<{
            idTutor: number;
            nome: string;
            pontuacao: number;
        }>;
    };

    const [pets, setPets] = useState<Pet[]>([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const [trails, setTrails] = useState<TrailProgressCardData[]>([]);
    const [loadingTrails, setLoadingTrails] = useState(true);
    const [availableTrails, setAvailableTrails] = useState<TrailProgressCardData[]>([]);
    const [loadingAvailableTrails, setLoadingAvailableTrails] = useState(true);
    const [ranking, setRanking] = useState<TutorRankingResponse["content"]>([]);
    const [loadingRanking, setLoadingRanking] = useState(true);
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
                trailId: item.trilha.idTrilha.toString(),
                progressId: item.idProgressoTrilha.toString(),
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
                trailId: item.idTrilha.toString(),
                title: item.nome,
                description: item.descricao,
                totalModules: item.modulosTotais,
                completedModules: 0,
                totalHours: item.horasTotais,
                difficulty: item.nivel,
                status: "Não Iniciada",
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

    const loadRanking = async () => {
        setLoadingRanking(true);
        try {
            const resp = await TutorAPI.ranking<TutorRankingResponse>(token);
            setRanking(resp?.content ?? []);
        } catch (e) {
            console.error("Erro ao carregar ranking de tutores:", e);
            setRanking([]);
        } finally {
            setLoadingRanking(false);
        }
    };

    useEffect(() => {
        loadPets();
        loadTrails();
        loadAvailableTrails();
        loadRanking();
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

    const handleStartTrail = async (trail: TrailProgressCardData) => {
        try {
            const resp = await TutorAPI.iniciarTrilha<{
                idProgressoTrilha: number;
                dataInicio: string | null;
                dataConclusao: string | null;
                status: string;
                modulosConcluidos: number;
                trilha: {
                    idTrilha: number;
                    nome: string;
                    descricao: string;
                    nivel: string;
                    horasTotais: number;
                    modulosTotais: number;
                };
            }>(trail.trailId, token);

            const started: TrailProgressCardData = {
                id: String(resp.idProgressoTrilha),
                trailId: String(resp.trilha.idTrilha),
                progressId: String(resp.idProgressoTrilha),
                title: resp.trilha.nome,
                description: resp.trilha.descricao,
                totalModules: resp.trilha.modulosTotais,
                completedModules: resp.modulosConcluidos,
                totalHours: resp.trilha.horasTotais,
                difficulty: resp.trilha.nivel,
                status: resp.status,
                startedAt: resp.dataInicio,
                finishedAt: resp.dataConclusao,
            };

            setTrails((prev) => {
                const others = prev.filter((t) => t.trailId !== started.trailId);
                return [started, ...others];
            });
            setAvailableTrails((prev) => prev.filter((t) => t.trailId !== started.trailId));

            navigate(`/trail/${started.trailId}`, { state: { trail: started } });
            toast({ title: "Trilha iniciada", description: `Você iniciou: ${started.title}` });
        } catch (e) {
            console.error("Erro ao iniciar trilha:", e);
        }
    };

    const handleContinueTrail = (trail: TrailProgressCardData) => {
        navigate(`/trail/${trail.trailId}`, { state: { trail } });
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
                                    variant="my"
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
                                    variant="available"
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Ranking de Tutores (lado esquerdo, mais compacto) */}
                <section>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Ranking de Tutores
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loadingRanking ? (
                                        <div className="text-muted-foreground">Carregando ranking…</div>
                                    ) : ranking.length === 0 ? (
                                        <div className="text-muted-foreground">Nenhum tutor no ranking ainda.</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-muted-foreground">
                                                        <th className="text-left py-2 px-3">Posição</th>
                                                        <th className="text-left py-2 px-3">Tutor</th>
                                                        <th className="text-right py-2 px-3">Pontuação</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ranking.map((row, idx) => {
                                                        const isMe = user?.id ? Number(user.id) === row.idTutor : false;
                                                        const rank = idx + 1;
                                                        const rankStyle =
                                                            rank === 1
                                                                ? "bg-yellow-50 border-yellow-200"
                                                                : rank === 2
                                                                ? "bg-zinc-50 border-zinc-200"
                                                                : rank === 3
                                                                ? "bg-amber-50 border-amber-200"
                                                                : "border-border";
                                                        const meStyle = isMe ? "bg-primary/5 border-primary" : "";
                                                        const rowClass = `border-t ${rankStyle} ${meStyle}`.trim();
                                                        return (
                                                            <tr key={row.idTutor} className={rowClass}>
                                                                <td className="py-3 px-3 font-medium">
                                                                    <div className="flex items-center gap-2">
                                                                        {rank <= 3 && (
                                                                            <Trophy
                                                                                className={`h-4 w-4 ${
                                                                                    rank === 1
                                                                                        ? "text-yellow-500"
                                                                                        : rank === 2
                                                                                        ? "text-zinc-400"
                                                                                        : "text-amber-600"
                                                                                }`}
                                                                            />
                                                                        )}
                                                                        <span>{rank}º</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">{row.nome}</span>
                                                                        {isMe && (
                                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                                                Você
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3 text-right">
                                                                    <span className="px-2 py-1 rounded-md bg-muted">{row.pontuacao.toFixed(1)}</span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="hidden lg:block lg:col-span-1" />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TutorDashboard;
