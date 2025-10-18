import {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Header from "@/components/layout/Header.tsx";
import WelcomeCard from "@/components/dashboard/WelcomeCard.tsx";
import StatsCard from "@/components/dashboard/StatsCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Plus, Trophy, Gift, ChevronLeft, ChevronRight} from "lucide-react";
import PetCard from "@/components/pets/PetCard.tsx";
import TrailCard, {TrailProgressCardData} from "@/components/learning/TrailCard.tsx";
import {PetAPI, TutorAPI, EspecieAPI, RacaAPI} from "@/lib/api";
import {useAuth} from "@/context/AuthContext";
import {toast} from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TutorDashboard = () => {
    const {token, user} = useAuth();
    const location = useLocation();

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
        totalPages?: number;
        number?: number; // current page
        first?: boolean;
        last?: boolean;
        size?: number;
        totalElements?: number;
        numberOfElements?: number;
    };

    type TutorRankingResponse = {
        content: Array<{
            idTutor: number;
            nome: string;
            pontuacao: number;
        }>;
    };

    type TutorRewardsResponse = {
        content: Array<{
            idRecompensa: number;
            titulo: string;
            descricao: string;
            pontuacaoMinima: number;
        }>;
        totalPages: number;
        number: number; // current page
        first: boolean;
        last: boolean;
        size: number;
        totalElements: number;
        numberOfElements: number;
    };

    type TutorProgress = {
        qtdPets: number;
        qtdTrilhasConcluidas: number;
        pontosTotais: number;
        qtdModulosConcluidos: number;
    };

    const [pets, setPets] = useState<Pet[]>([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const [trails, setTrails] = useState<TrailProgressCardData[]>([]);
    const [loadingTrails, setLoadingTrails] = useState(true);
    const [availableTrails, setAvailableTrails] = useState<TrailProgressCardData[]>([]);
    const [loadingAvailableTrails, setLoadingAvailableTrails] = useState(true);
    const [availablePage, setAvailablePage] = useState<number>(0);
    const [availableLast, setAvailableLast] = useState<boolean>(true);
    const [availableFirst, setAvailableFirst] = useState<boolean>(true);
    const [availableTotalPages, setAvailableTotalPages] = useState<number>(0);
    const AVAILABLE_PAGE_SIZE = 6;
    const [allBreeds, setAllBreeds] = useState<{ idRaca: number; nome: string }[]>([]);
    const [loadingBreeds, setLoadingBreeds] = useState<boolean>(false);
    const [selectedBreedId, setSelectedBreedId] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<"" | "INICIANTE" | "INTERMEDIARIO" | "AVANCADO">("");
    const [ranking, setRanking] = useState<TutorRankingResponse["content"]>([]);
    const [loadingRanking, setLoadingRanking] = useState(true);
    const [rewards, setRewards] = useState<TutorRewardsResponse["content"]>([]);
    const [loadingRewards, setLoadingRewards] = useState(true);
    const [rewardsPage, setRewardsPage] = useState<number>(0);
    const [rewardsLast, setRewardsLast] = useState<boolean>(true);
    const [rewardsFirst, setRewardsFirst] = useState<boolean>(true);
    const [rewardsTotalPages, setRewardsTotalPages] = useState<number>(0);
    const [userPoints, setUserPoints] = useState<number>(0);
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

    const loadAvailableTrails = async (filters?: { idRaca?: string | number; nivel?: "INICIANTE" | "INTERMEDIARIO" | "AVANCADO"; page?: number; size?: number }) => {
        setLoadingAvailableTrails(true);
        try {
            const resp = await TutorAPI.trilhasDisponiveis<TutorAvailableTrailsResponse>(token, {
                page: filters?.page ?? availablePage,
                size: filters?.size ?? AVAILABLE_PAGE_SIZE,
                idRaca: filters?.idRaca,
                nivel: filters?.nivel,
            });
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
            setAvailablePage(resp?.number ?? 0);
            setAvailableLast(resp?.last ?? true);
            setAvailableFirst(resp?.first ?? true);
            setAvailableTotalPages(resp?.totalPages ?? 0);
        } catch (e) {
            console.error("Erro ao carregar trilhas disponíveis:", e);
            setAvailableTrails([]);
            setAvailablePage(0);
            setAvailableLast(true);
            setAvailableFirst(true);
            setAvailableTotalPages(0);
        } finally {
            setLoadingAvailableTrails(false);
        }
    };

    // Carregar todas as raças disponíveis (agregando por espécie)
    useEffect(() => {
        const loadBreeds = async () => {
            setLoadingBreeds(true);
            try {
                const especies = await EspecieAPI.buscarEspecies<{ idEspecie: number; nome: string }[]>(token);
                const all: { idRaca: number; nome: string }[] = [];
                for (const esp of especies ?? []) {
                    try {
                        const racas = await RacaAPI.buscarRacasPorEspecie<{ idRaca: number; nome: string }[]>(esp.idEspecie, token);
                        (racas ?? []).forEach((r) => all.push({ idRaca: r.idRaca, nome: r.nome }));
                    } catch (err) {
                        console.warn("Falha ao buscar raças da espécie", esp.idEspecie, err);
                    }
                }
                // Remover duplicadas por idRaca
                const unique = Array.from(new Map(all.map(r => [r.idRaca, r])).values())
                    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
                setAllBreeds(unique);
            } catch (e) {
                console.error("Erro ao carregar espécies/raças:", e);
                setAllBreeds([]);
            } finally {
                setLoadingBreeds(false);
            }
        };
        loadBreeds();
    }, [token]);

    // Recarregar trilhas disponíveis quando filtros mudarem (resetar para página 0)
    useEffect(() => {
        const filters: { idRaca?: number; nivel?: "INICIANTE" | "INTERMEDIARIO" | "AVANCADO" } = {};
        if (selectedBreedId) filters.idRaca = Number(selectedBreedId);
        if (selectedLevel) filters.nivel = selectedLevel;
        setAvailablePage(0);
        loadAvailableTrails({ ...filters, page: 0, size: AVAILABLE_PAGE_SIZE });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBreedId, selectedLevel, token]);

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

    const loadRewards = async (page = 0) => {
        setLoadingRewards(true);
        try {
            const resp = await TutorAPI.recompensas<TutorRewardsResponse>(token, { page, size: 3 });
            setRewards(resp?.content ?? []);
            setRewardsPage(resp?.number ?? 0);
            setRewardsLast(resp?.last ?? true);
            setRewardsFirst(resp?.first ?? true);
            setRewardsTotalPages(resp?.totalPages ?? 0);
        } catch (e) {
            console.error("Erro ao carregar recompensas:", e);
            setRewards([]);
            setRewardsPage(0);
            setRewardsLast(true);
            setRewardsFirst(true);
            setRewardsTotalPages(0);
        } finally {
            setLoadingRewards(false);
        }
    };

    const loadUserPoints = async () => {
        try {
            const progress = await TutorAPI.meuProgresso<TutorProgress>(token);
            setUserPoints(progress?.pontosTotais ?? 0);
        } catch (e) {
            setUserPoints(0);
        }
    };

    useEffect(() => {
        loadPets();
        loadTrails();
        loadAvailableTrails();
        loadRanking();
        loadRewards(0);
        loadUserPoints();
    }, [token]);

    // Scroll suave para seção quando há hash na URL (ex.: /tutor#meus-pets)
    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.replace('#', '');
        // map de aliases
        const alias: Record<string, string> = {
            'meus-pets': 'meus-pets',
            'minhas-trilhas': 'minhas-trilhas',
            'trilhas-disponiveis': 'trilhas-disponiveis',
        };
        const targetId = alias[id] ?? id;
        // pequeno delay para garantir renderização
        setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }, [location.hash]);

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
                <section id="minhas-trilhas">
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
                <section id="trilhas-disponiveis">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Trilhas Disponíveis</h2>
                    </div>

                    {/* Filtros minimalistas */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="min-w-[220px]">
                            <Select
                                value={selectedBreedId}
                                onValueChange={(value) => setSelectedBreedId(value)}
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder={loadingBreeds ? "Raças…" : "Raça (opcional)"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {allBreeds.map((r) => (
                                        <SelectItem key={r.idRaca} value={String(r.idRaca)}>
                                            {r.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="min-w-[200px]">
                            <Select
                                value={selectedLevel}
                                onValueChange={(value: "INICIANTE" | "INTERMEDIARIO" | "AVANCADO") => setSelectedLevel(value)}
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Nível (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INICIANTE">Iniciante</SelectItem>
                                    <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
                                    <SelectItem value="AVANCADO">Avançado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="ghost"
                            className="h-9 text-sm"
                            onClick={() => { setSelectedBreedId(""); setSelectedLevel(""); }}
                            disabled={loadingAvailableTrails}
                        >
                            Limpar
                        </Button>
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

                    {/* Paginação das Trilhas Disponíveis */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            disabled={loadingAvailableTrails || availableFirst}
                            onClick={() => !availableFirst && loadAvailableTrails({ page: availablePage - 1 })}
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
                            {availableTotalPages === 0 ? 0 : availablePage + 1} / {availableTotalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            disabled={loadingAvailableTrails || availableLast}
                            onClick={() => !availableLast && loadAvailableTrails({ page: availablePage + 1 })}
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </section>

                {/* Ranking + Recompensas (50/50 lado a lado) */}
                <section className="mt-16 lg:mt-24">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Ranking e Recompensas</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* Ranking */}
                        <div className="flex">
                            <Card className="shadow-card h-[560px] flex flex-col w-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Ranking de Tutores
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto">
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
                        {/* Recompensas */}
                        <div className="flex">
                            <Card className="shadow-card h-full flex flex-col w-full">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <Gift className="h-5 w-5 text-emerald-500" />
                                            Loja de Recompensas
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                            Seus pontos: <span className="font-semibold text-foreground">{new Intl.NumberFormat("pt-BR").format(userPoints)}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col overflow-y-auto">
                                    {loadingRewards ? (
                                        <div className="text-muted-foreground">Carregando recompensas…</div>
                                    ) : rewards.length === 0 ? (
                                        <div className="text-muted-foreground">Nenhuma recompensa disponível no momento.</div>
                                    ) : (
                                        <div className="space-y-4 flex-1">
                                            {rewards.map((r) => {
                                                const canRedeem = userPoints >= r.pontuacaoMinima;
                                                return (
                                                    <div key={r.idRecompensa} className="rounded-lg border border-border/70 p-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="font-medium">{r.titulo}</div>
                                                                <div className="text-xs text-muted-foreground">{r.descricao}</div>
                                                            </div>
                                                            <div className="text-xs font-semibold whitespace-nowrap px-2 py-1 rounded-md bg-muted">
                                                                {r.pontuacaoMinima.toFixed(0)} pts
                                                            </div>
                                                        </div>
                                                        <div className="mt-3">
                                                            <Button
                                                                className="w-full"
                                                                disabled={!canRedeem}
                                                                onClick={() => {
                                                                    if (!canRedeem) return;
                                                                    toast({ title: "Resgate", description: "Resgate de recompensa em breve." });
                                                                }}
                                                            >
                                                                {canRedeem ? "Resgatar" : "Pontos insuficientes"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {/* Pagination controls - minimal */}
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full"
                                            disabled={loadingRewards || rewardsFirst}
                                            onClick={() => !rewardsFirst && loadRewards(rewardsPage - 1)}
                                            aria-label="Página anterior"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
                                            {rewardsTotalPages === 0 ? 0 : rewardsPage + 1} / {rewardsTotalPages}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full"
                                            disabled={loadingRewards || rewardsLast}
                                            onClick={() => !rewardsLast && loadRewards(rewardsPage + 1)}
                                            aria-label="Próxima página"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TutorDashboard;
