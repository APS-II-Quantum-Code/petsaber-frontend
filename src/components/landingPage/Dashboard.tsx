import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Progress} from "@/components/ui/progress"
import {Trophy, Flame, Star, Award, TrendingUp, Calendar, Clock, Stethoscope, Shield} from "lucide-react"

export function Dashboard() {
    const achievements = [
        {name: "Primeiro Diagnóstico", icon: "🔍", earned: true},
        {name: "Prevenção Expert", icon: "🛡️", earned: true},
        {name: "Cuidador Dedicado", icon: "❤️", earned: true},
        {name: "Especialista Canino", icon: "🐕", earned: false},
        {name: "Especialista Felino", icon: "🐱", earned: false},
        {name: "Veterinário Honorário", icon: "🩺", earned: false},
    ]

    return (
        <section id="dashboard" className="py-20 px-4 bg-muted/30">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Acompanhe seu Progresso</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Dashboard focado em seu aprendizado sobre saúde preventiva
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Stats Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pontos Totais</CardTitle>
                                    <Trophy className="h-4 w-4 text-primary"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,247</div>
                                    <p className="text-xs text-muted-foreground">+120 pontos esta semana</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sequência</CardTitle>
                                    <Flame className="h-4 w-4 text-orange-500"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">7 dias</div>
                                    <p className="text-xs text-muted-foreground">Sua melhor sequência: 12 dias</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
                                    <Star className="h-4 w-4 text-yellow-500"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Nível 4</div>
                                    <Progress value={45} className="mt-2"/>
                                    <p className="text-xs text-muted-foreground mt-1">225/500 XP para o próximo
                                        nível</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Módulos de Saúde</CardTitle>
                                    <Stethoscope className="h-4 w-4 text-green-500"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">4/12</div>
                                    <Progress value={33} className="mt-2"/>
                                    <p className="text-xs text-muted-foreground mt-1">33% do conteúdo de saúde</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5"/>
                                    Atividade Recente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Concluiu "Sinais de Alerta em Cães"</p>
                                        <p className="text-xs text-muted-foreground">Há 1 hora • +100 pontos</p>
                                    </div>
                                    <Badge variant="secondary">+100 XP</Badge>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Conquistou "Prevenção Expert"</p>
                                        <p className="text-xs text-muted-foreground">Ontem • Medalha especial</p>
                                    </div>
                                    <Badge>🛡️</Badge>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Quiz "Parasitas em Gatos" - 8/10</p>
                                        <p className="text-xs text-muted-foreground">2 dias atrás • +50 pontos</p>
                                    </div>
                                    <Badge variant="secondary">+50 XP</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5"/>
                                    Conquistas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {achievements.map((achievement, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 p-2 rounded-lg ${
                                            achievement.earned ? "bg-primary/10" : "bg-muted/50 opacity-50"
                                        }`}
                                    >
                                        <div className="text-2xl">{achievement.icon}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{achievement.name}</p>
                                        </div>
                                        {achievement.earned && (
                                            <Badge variant="secondary" className="text-xs">
                                                ✓
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5"/>
                                    Próximas Metas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Completar trilha de Cães</p>
                                        <p className="text-xs text-muted-foreground">2 módulos restantes</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Alcançar Nível 5</p>
                                        <p className="text-xs text-muted-foreground">275 XP restantes</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Stethoscope className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Resgatar consulta gratuita</p>
                                        <p className="text-xs text-muted-foreground">553 pontos restantes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
