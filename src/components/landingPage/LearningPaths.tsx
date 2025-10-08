"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Stethoscope, Shield, Clock, Users } from "lucide-react"

export function LearningPaths() {
    const paths = [
        {
            icon: Stethoscope,
            title: "Saúde Preventiva - Cães",
            description: "Prevenção de doenças, sintomas de alerta e cuidados essenciais para cães",
            modules: 6,
            duration: "2-3 semanas",
            level: "Essencial",
            progress: 0,
            color: "bg-blue-100 text-blue-600",
            petType: "dog",
        },
        {
            icon: Shield,
            title: "Saúde Preventiva - Gatos",
            description: "Prevenção de contaminações, sintomas específicos e cuidados para gatos",
            modules: 6,
            duration: "2-3 semanas",
            level: "Essencial",
            progress: 20,
            color: "bg-green-100 text-green-600",
            petType: "cat",
        },
    ]

    return (
        <section id="trilhas" className="py-20 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Trilhas de Saúde Animal</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Aprenda a prevenir doenças e identificar sintomas precocemente no seu pet
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {paths.map((path, index) => (
                        <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`p-3 rounded-lg ${path.color}`}>
                                        <path.icon className="h-8 w-8" />
                                    </div>
                                    <Badge variant="default">{path.level}</Badge>
                                </div>
                                <CardTitle className="text-xl">{path.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{path.description}</p>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {path.modules} módulos
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {path.duration}
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-3 rounded-lg">
                                    <p className="text-sm font-medium mb-2">Módulos inclusos:</p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>• Sinais de alerta e sintomas precoces</li>
                                        <li>• Prevenção de parasitas e contaminações</li>
                                        <li>• Vacinação e cuidados preventivos</li>
                                        <li>• Primeiros socorros básicos</li>
                                        <li>• Quando procurar o veterinário</li>
                                        <li>• Higiene e ambiente saudável</li>
                                    </ul>
                                </div>

                                {path.progress > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progresso</span>
                                            <span>{path.progress}%</span>
                                        </div>
                                        <Progress value={path.progress} className="h-2" />
                                    </div>
                                )}

                                <Button
                                    className="w-full"
                                    variant={path.progress > 0 ? "default" : "outline"}
                                >
                                    {path.progress > 0 ? "Continuar" : "Começar"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
