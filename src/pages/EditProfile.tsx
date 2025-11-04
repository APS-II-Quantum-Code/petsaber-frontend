import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ArrowLeft, User, IdCard, Lock, Phone, Calendar, Globe, Image as ImageIcon, Gift, Trophy} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import {useToast} from "@/hooks/use-toast";
import {useAuth} from "@/context/AuthContext";
import {TutorAPI} from "@/lib/api";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const EditProfile = () => {
    const navigate = useNavigate();
    const {toast} = useToast();
    const {user, token} = useAuth();

    const [formData, setFormData] = useState({
        nome: user?.nome ?? "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        genero: "",
        nacionalidade: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const [passwordData, setPasswordData] = useState({
        atual: "",
        nova: "",
        confirmar: "",
    });

    // Foto de perfil (somente UI/preview)
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);

    // Estatísticas do tutor
    const [stats, setStats] = useState<{
        qtdPets: number;
        qtdTrilhasConcluidas: number;
        pontosTotais: number;
        qtdModulosConcluidos: number
    } | null>(null);

    // Recompensas do tutor
    const [rewards, setRewards] = useState<Array<{
        idRecompensa: number;
        titulo: string;
        descricao: string;
        pontuacaoMinima: number
    }>>([]);
    const [loadingRewards, setLoadingRewards] = useState(false);

    // Carrega dados reais do backend (/tutor/meus-dados) ao montar
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const resp = await TutorAPI.meusDados<{
                    idTutor: number;
                    nome: string;
                    cpf: string;
                    telefone?: string;
                    dataNascimento?: string; // YYYY-MM-DD
                    genero?: string;
                    nacionalidade?: string;
                }>(token);
                if (!mounted || !resp) return;
                setFormData({
                    nome: resp.nome ?? "",
                    cpf: resp.cpf ?? "",
                    telefone: resp.telefone ?? "",
                    dataNascimento: resp.dataNascimento ?? "",
                    genero: resp.genero ?? "",
                    nacionalidade: resp.nacionalidade ?? "",
                });
            } catch (e) {
                // silencioso, mantém valores atuais (user)
                console.warn("Falha ao carregar meus dados", e);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [token]);

    // Carrega estatísticas e recompensas
    useEffect(() => {
        let mounted = true;
        const loadStats = async () => {
            try {
                const s = await TutorAPI.meuProgresso<{
                    qtdPets: number;
                    qtdTrilhasConcluidas: number;
                    pontosTotais: number;
                    qtdModulosConcluidos: number
                }>(token);
                if (!mounted) return;
                setStats(s ?? null);
            } catch (e) {
                if (!mounted) return;
                setStats(null);
            }
        };
        const loadRewards = async () => {
            setLoadingRewards(true);
            try {
                const r = await TutorAPI.recompensas<{
                    content: Array<{ idRecompensa: number; titulo: string; descricao: string; pontuacaoMinima: number }>
                }>(token, {page: 0, size: 3});
                if (!mounted) return;
                setRewards(r?.content ?? []);
            } catch (e) {
                if (!mounted) return;
                setRewards([]);
            } finally {
                if (!mounted) return;
                setLoadingRewards(false);
            }
        };
        loadStats();
        loadRewards();
        return () => {
            mounted = false;
        };
    }, [token]);

    // Atualiza preview quando um arquivo é selecionado
    useEffect(() => {
        if (!profileFile) {
            setProfilePreview(null);
            return;
        }
        const url = URL.createObjectURL(profileFile);
        setProfilePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [profileFile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nome) {
            toast({title: "Campos obrigatórios", description: "Preencha o nome.", variant: "destructive"});
            return;
        }
        try {
            setSubmitting(true);
            await TutorAPI.atualizarPerfil<unknown>({
                nome: formData.nome,
                cpf: formData.cpf,
                telefone: formData.telefone,
                dataNascimento: formData.dataNascimento,
                genero: formData.genero,
                nacionalidade: formData.nacionalidade,
            }, token);
            if (profileFile) {
                // Integração de upload de foto não implementada (sem endpoint). Somente UI/preview por enquanto.
                toast({
                    title: "Foto não enviada",
                    description: "Upload de foto ainda não implementado.",
                    variant: "default"
                });
            }
            toast({title: "Perfil atualizado!", description: "Suas informações foram atualizadas com sucesso."});
        } catch (err) {
            // apiFetch já exibe toast de erro
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.nova !== passwordData.confirmar) {
            toast({
                title: "Senhas não conferem",
                description: "A confirmação deve ser igual à nova senha.",
                variant: "destructive"
            });
            return;
        }
        if (!passwordData.atual || !passwordData.nova) {
            toast({
                title: "Campos obrigatórios",
                description: "Preencha a senha atual e a nova senha.",
                variant: "destructive"
            });
            return;
        }
        try {
            await TutorAPI.atualizarSenha<void>({ senhaAtual: passwordData.atual, novaSenha: passwordData.nova }, token);
            toast({title: "Senha atualizada!", description: "Sua senha foi alterada com sucesso."});
            setPasswordData({atual: "", nova: "", confirmar: ""});
        } catch (err) {
            // apiFetch já exibe toast de erro
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Header/>
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Link to="/me">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4"/>
                                Voltar
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
                    </div>

                    {/* Dados + Estatísticas lado a lado */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="shadow-card lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <User className="h-5 w-5 text-primary"/>
                                    Seus Dados
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Foto de Perfil dentro da seção */}
                                    <div className="space-y-2">
                                        <Label htmlFor="foto-perfil">Foto de Perfil</Label>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-20 w-20">
                                                {profilePreview ? (
                                                    <AvatarImage src={profilePreview} alt="Pré-visualização da foto"/>
                                                ) : (
                                                    <AvatarFallback>{(formData.nome?.[0] ?? "U").toUpperCase()}</AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="space-y-2">
                                                <input
                                                    id="foto-perfil"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] ?? null;
                                                        setProfileFile(file);
                                                    }}
                                                />
                                                <div className="flex items-center gap-3">
                                                    <Button type="button" variant="outline" size="sm"
                                                            className="h-8 px-3"
                                                            onClick={() => document.getElementById('foto-perfil')?.click()}>
                                                        Escolher imagem
                                                    </Button>
                                                    {profileFile && (
                                                        <span
                                                            className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {profileFile.name}
                          </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Selecione uma imagem
                                                    quadrada para melhor resultado.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nome">Nome Completo *</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="nome"
                                                type="text"
                                                placeholder="Seu nome completo"
                                                className="pl-10"
                                                value={formData.nome}
                                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="telefone">Telefone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="telefone"
                                                type="tel"
                                                placeholder="(00) 00000-0000"
                                                className="pl-10"
                                                value={formData.telefone}
                                                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <div className="relative">
                                            <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="cpf"
                                                type="text"
                                                placeholder="000.000.000-00"
                                                className="pl-10"
                                                value={formData.cpf}
                                                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                                            <div className="relative">
                                                <Calendar
                                                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                                <Input
                                                    id="dataNascimento"
                                                    type="date"
                                                    className="pl-10"
                                                    value={formData.dataNascimento}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        dataNascimento: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="genero">Gênero</Label>
                                            <Select
                                                value={formData.genero}
                                                onValueChange={(value) => setFormData({...formData, genero: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o gênero"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Masculino">Masculino</SelectItem>
                                                    <SelectItem value="Feminino">Feminino</SelectItem>
                                                    <SelectItem value="Não-binário">Não-binário</SelectItem>
                                                    <SelectItem value="Outro">Outro</SelectItem>
                                                    <SelectItem value="Prefiro não informar">Prefiro não
                                                        informar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nacionalidade">Nacionalidade</Label>
                                        <Select
                                            value={formData.nacionalidade}
                                            onValueChange={(value) => setFormData({...formData, nacionalidade: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a nacionalidade"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Brasileiro(a)">Brasileiro(a)</SelectItem>
                                                <SelectItem value="Estrangeiro(a)">Estrangeiro(a)</SelectItem>
                                                <SelectItem value="Outro">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" className="flex-1" disabled={submitting}>
                                            Salvar Alterações
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => navigate("/me")}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                        {/* Coluna direita: Estatísticas + Recompensas empilhadas */}
                        <div className="flex flex-col gap-6">
                            {/* Estatísticas */}
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Trophy className="h-5 w-5 text-yellow-500"/>
                                        Suas Estatísticas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {stats ? (
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="rounded-md border p-3">
                                                <div className="text-xl font-semibold">{stats.qtdPets}</div>
                                                <div className="text-muted-foreground">Pets</div>
                                            </div>
                                            <div className="rounded-md border p-3">
                                                <div
                                                    className="text-xl font-semibold">{stats.qtdTrilhasConcluidas}</div>
                                                <div className="text-muted-foreground">Trilhas concluídas</div>
                                            </div>
                                            <div className="rounded-md border p-3">
                                                <div className="text-xl font-semibold">{stats.pontosTotais}</div>
                                                <div className="text-muted-foreground">Pontos</div>
                                            </div>
                                            <div className="rounded-md border p-3">
                                                <div className="text-xl font-semibold">{stats.qtdModulosConcluidos}</div>
                                                <div className="text-muted-foreground">Módulos concluídos</div>

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground text-sm">Não foi possível carregar suas
                                            estatísticas.</div>
                                    )}
                                </CardContent>
                            </Card>
                            {/* Recompensas embaixo das estatísticas */}
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Gift className="h-5 w-5 text-emerald-500"/>
                                        Suas Recompensas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loadingRewards ? (
                                        <div className="text-muted-foreground text-sm">Carregando recompensas…</div>
                                    ) : rewards.length === 0 ? (
                                        <div className="text-muted-foreground text-sm">Nenhuma recompensa disponível no
                                            momento.</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {rewards.map((r) => (
                                                <div key={r.idRecompensa} className="rounded-md border p-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <div className="font-medium">{r.titulo}</div>
                                                            <div
                                                                className="text-xs text-muted-foreground">{r.descricao}</div>
                                                        </div>
                                                        <div
                                                            className="text-xs font-semibold whitespace-nowrap px-2 py-1 rounded-md bg-muted">
                                                            {r.pontuacaoMinima.toFixed(0)} pts
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        {/* alterar Senha: mesma largura dos Dados (2 colunas) */}
                        <Card className="shadow-card lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Lock className="h-5 w-5 text-primary"/>
                                    Alterar Senha
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="senha-atual">Senha atual</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                id="senha-atual"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={passwordData.atual}
                                                onChange={(e) => setPasswordData({
                                                    ...passwordData,
                                                    atual: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nova-senha">Nova senha</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                                <Input
                                                    id="nova-senha"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    value={passwordData.nova}
                                                    onChange={(e) => setPasswordData({
                                                        ...passwordData,
                                                        nova: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                                <Input
                                                    id="confirmar-senha"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    value={passwordData.confirmar}
                                                    onChange={(e) => setPasswordData({
                                                        ...passwordData,
                                                        confirmar: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button type="submit" className="flex-1">Atualizar Senha</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;