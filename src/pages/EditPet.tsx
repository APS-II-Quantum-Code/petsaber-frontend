import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, Heart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import {EspecieAPI, RacaAPI, PorteAPI, PetAPI} from "@/lib/api.ts";
import {useAuth} from "@/context/AuthContext.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {Pet} from "@/interfaces/Pet.ts";

type Especie = {
    idEspecie: number;
    nome: string;
};

type Raca = {
    idRaca: number;
    nome: string;
};

type Porte = {
    idPorte: number;
    nome: string;
    descricao: string;
};

type PetApiResponse = {
    idPet: number;
    nome: string;
    especie: { idEspecie: number; nome: string; };
    raca: { idRaca: number; nome: string; };
    dataNascimento: string;
    idade: number;
    porte: { idPorte: number; nome: string; descricao: string; };
    sexo: string;
    urlImagem: string | null;
};

const EditPet = () => {
    const {id} = useParams<{ id: string }>();
    const {token} = useAuth();
    const navigate = useNavigate();
    const {toast} = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        idEspecie: "",
        idRaca: "",
        mesNascimento: "",
        anoNascimento: "",
        idPorte: "",
        sexo: "",
    });

    const [especies, setEspecies] = useState<Especie[]>([]);
    const [racas, setRacas] = useState<Raca[]>([]);
    const [portes, setPortes] = useState<Porte[]>([]);
    const [isRacasLoading, setIsRacasLoading] = useState(false);

    useEffect(() => {
        const fetchEspecies = async () => {
            try {
                const data = await EspecieAPI.buscarEspecies<Especie[]>(token);
                if (Array.isArray(data)) {
                    setEspecies(data);
                }
            } catch (error) {
                console.error("Failed to fetch species", error);
            }
        };
        fetchEspecies();
    }, [token]);

    useEffect(() => {
        const fetchPortes = async () => {
            try {
                const data = await PorteAPI.buscarPortes<Porte[]>(token);
                if (Array.isArray(data)) {
                    setPortes(data);
                }
            } catch (error) {
                console.error("Failed to fetch portes", error);
            }
        };
        fetchPortes();
    }, [token]);

    useEffect(() => {
        if (formData.idEspecie) {
            const fetchRacas = async () => {
                setIsRacasLoading(true);
                try {
                    const data = await RacaAPI.buscarRacasPorEspecie<Raca[]>(parseInt(formData.idEspecie), token);
                    if (Array.isArray(data)) {
                        setRacas(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch breeds", error);
                    setRacas([]);
                } finally {
                    setIsRacasLoading(false);
                }
            };
            fetchRacas();
        } else {
            setRacas([]);
        }
    }, [formData.idEspecie, token]);

    useEffect(() => {
        if (id && token) {
            const fetchPetData = async () => {
                try {
                    const pet = await PetAPI.buscarPetPorId<PetApiResponse>(id, token);
                    const [year, month] = pet.dataNascimento ? pet.dataNascimento.split('-') : ["", ""];
                    setFormData({
                        nome: pet.nome,
                        idEspecie: pet.especie.idEspecie.toString(),
                        idRaca: pet.raca.idRaca.toString(),
                        mesNascimento: month,
                        anoNascimento: year,
                        idPorte: pet.porte.idPorte.toString(),
                        sexo: pet.sexo,
                    });
                } catch (error) {
                    console.error("Failed to fetch pet data", error);
                    toast({title: "Erro", description: "Falha ao buscar dados do pet.", variant: "destructive"});
                }
            };
            fetchPetData();
        }
    }, [id, token, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setIsSubmitting(true);

        const {mesNascimento, anoNascimento, ...rest} = formData;
        const dataNascimento = anoNascimento && mesNascimento ? `${anoNascimento}-${mesNascimento}-01` : null;

        const submissionData = {
            ...rest,
            dataNascimento,
            sexo: formData.sexo.toUpperCase(),
        };

        try {
            await PetAPI.atualizarPet(id, submissionData, token);
            toast({
                title: "Sucesso!",
                description: "As informações do pet foram atualizadas com sucesso.",
            });
            navigate("/tutor"); // Navigate to a relevant page after update
        } catch (error) {
            console.error("Failed to update pet", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Header/>
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Link to="/me">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4"/>
                                Voltar
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-foreground">Editar Pet</h1>
                    </div>

                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Heart className="h-5 w-5 text-primary"/>
                                Informações do Pet
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome do Pet *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Ex: Buddy, Luna, Max..."
                                            value={formData.nome}
                                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="species">Espécie *</Label>
                                        <Select
                                            value={formData.idEspecie}
                                            onValueChange={(value) => setFormData({
                                                ...formData,
                                                idEspecie: value,
                                                idRaca: ""
                                            })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a espécie"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {especies.map((especie) => (
                                                    <SelectItem key={especie.idEspecie}
                                                                value={especie.idEspecie.toString()}>
                                                        {especie.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="breed">Raça</Label>
                                        <Select
                                            value={formData.idRaca}
                                            onValueChange={(value) => setFormData({...formData, idRaca: value})}
                                            disabled={!formData.idEspecie || isRacasLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={isRacasLoading ? "Carregando raças..." : "Selecione a raça"}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {racas.map((raca) => (
                                                    <SelectItem key={raca.idRaca} value={raca.idRaca.toString()}>
                                                        {raca.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Data de Nascimento</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Select
                                                    value={formData.mesNascimento}
                                                    onValueChange={(value) => setFormData({
                                                        ...formData,
                                                        mesNascimento: value
                                                    })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Mês"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({length: 12}, (_, i) => (
                                                            <SelectItem key={i + 1}
                                                                        value={(i + 1).toString().padStart(2, '0')}>
                                                                {new Date(0, i).toLocaleString('pt-BR', {month: 'long'}).charAt(0).toUpperCase() + new Date(0, i).toLocaleString('pt-BR', {month: 'long'}).slice(1)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Select
                                                    value={formData.anoNascimento}
                                                    onValueChange={(value) => setFormData({
                                                        ...formData,
                                                        anoNascimento: value
                                                    })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Ano"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({length: 100}, (_, i) => new Date().getFullYear() - i).map(year => (
                                                            <SelectItem key={year} value={year.toString()}>
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="size">Porte *</Label>
                                        <Select
                                            value={formData.idPorte}
                                            onValueChange={(value) => setFormData({...formData, idPorte: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o porte"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {portes.map((porte) => (
                                                    <SelectItem key={porte.idPorte} value={porte.idPorte.toString()}>
                                                        {porte.nome} ({porte.descricao})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Sexo *</Label>
                                        <Select
                                            value={formData.sexo}
                                            onValueChange={(value) => setFormData({...formData, sexo: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o sexo"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MACHO">Macho</SelectItem>
                                                <SelectItem value="FEMEA">Fêmea</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button type="submit" className="flex-1" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                    <Link to="/me" className="flex-1">
                                        <Button variant="outline" className="w-full" size="lg">
                                            Cancelar
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditPet;