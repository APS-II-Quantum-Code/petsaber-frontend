"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Progress} from "@/components/ui/progress"
import {Crown, Medal, Gift, Zap, Stethoscope, Syringe, TestTube, Percent} from "lucide-react"

export function Gamification() {

    const leaderboard = [
        {rank: 1, name: "Maria Silva", points: 4250, avatar: "👩‍🦰"},
        {rank: 2, name: "João Santos", points: 3890, avatar: "👨‍🦱"},
        {rank: 3, name: "Ana Costa", points: 3654, avatar: "👩‍🦳", isUser: true},
        {rank: 5, name: "Pedro Lima", points: 2456, avatar: "👨‍🦲"},
    ]

    const rewards = [
        {
            title: "Vacina Gratuita",
            points: 800,
            description: "Vacina gratuita (V8 ou V10) em clínicas veterinárias parceiras",
            icon: Syringe,
            available: 800
        },
        {
            title: "Exame de Sangue Gratuito",
            points: 1200,
            description: "Hemograma completo gratuito para check-up do seu pet",
            icon: TestTube,
            available: 1200
        },
        {
            title: "50% Desconto na Consulta",
            points: 600,
            description: "Desconto de 50% em consulta veterinária de rotina",
            icon: Percent,
            available: 600
        }
    ]

    return (
        <section id="ranking" className="py-20 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Sistema de Recompensas</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Ganhe pontos aprendendo e troque por cuidados reais para seu pet
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Leaderboard */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="h-5 w-5 text-yellow-500"/>
                                Ranking Semanal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {leaderboard.map((userItem, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 p-3 rounded-lg ${
                                        userItem.isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                userItem.rank === 1
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : userItem.rank === 2
                                                        ? "bg-gray-100 text-gray-700"
                                                        : userItem.rank === 3
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {userItem.rank}
                                        </div>
                                        <div className="text-2xl">{userItem.avatar}</div>
                                    </div>

                                    <div className="flex-1">
                                        <p className={`font-medium ${userItem.isUser ? "text-primary" : ""}`}>{userItem.name}</p>
                                        <p className="text-sm text-muted-foreground">{userItem.points.toLocaleString()} pontos</p>
                                    </div>

                                    {userItem.rank <= 3 && (
                                        <Medal
                                            className={`h-5 w-5 ${
                                                userItem.rank === 1
                                                    ? "text-yellow-500"
                                                    : userItem.rank === 2
                                                        ? "text-gray-500"
                                                        : "text-orange-500"
                                            }`}
                                        />
                                    )}

                                    {userItem.isUser && <Badge variant="secondary">Você</Badge>}
                                </div>
                            ))}


                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Próximo nível em:</span>
                                    <span className="font-medium">{500 - (1000 % 500)} pontos</span>
                                </div>
                                <Progress value={(1000 % 500) / 5} className="mt-2"/>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rewards Store */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="h-5 w-5 text-primary"/>
                                Loja de Recompensas
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Seus pontos: <span className="font-bold text-primary">{1000}</span>
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rewards.map((reward, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${
                                        reward.available ? "border-primary/20 bg-primary/5" : "border-muted bg-muted/30"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <reward.icon className="h-4 w-4 text-primary"/>
                                            <h4 className="font-medium">{reward.title}</h4>
                                        </div>
                                        <Badge
                                            variant={reward.available ? "default" : "secondary"}>{reward.points} pts</Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>

                                    <Button
                                        size="sm"
                                        className="w-full"
                                        disabled={!reward.available}
                                        variant={reward.available ? "default" : "secondary"}
                                    >
                                        {"Resgatar"}
                                    </Button>
                                </div>
                            ))}

                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Zap className="h-4 w-4"/>
                                    <span>Ganhe mais pontos:</span>
                                </div>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                    <li>• Complete módulos de saúde: +100 pontos</li>
                                    <li>• Acerte quizzes de sintomas: +50 pontos</li>
                                    <li>• Sequência diária de estudos: +20 pontos</li>
                                    <li>• Compartilhe conhecimento: +30 pontos</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
