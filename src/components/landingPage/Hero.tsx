"use client"

import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Star, Users, Stethoscope, Shield, Play} from "lucide-react"
import { Link } from "react-router-dom"

export function Hero() {

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto text-center">
                <Badge variant="secondary" className="mb-6">
                    🐾 Saúde Preventiva para Pets
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                    Proteja a <span className="text-primary">saúde</span> do seu pet com conhecimento
                </h1>

                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                    Aprenda a prevenir doenças, identificar sintomas precoces e cuidar da saúde do seu cão ou gato com
                    conteúdo
                    validado por veterinários.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button size="lg" className="text-lg px-8" asChild>
                        <Link to="/login">
                            {"Começar Agora - Grátis"}
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <Card className="p-6 text-center">
                        <Users className="h-8 w-8 text-primary mx-auto mb-2"/>
                        <div className="text-2xl font-bold">5k+</div>
                        <div className="text-sm text-muted-foreground">Tutores Ativos</div>
                    </Card>

                    <Card className="p-6 text-center">
                        <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2"/>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-muted-foreground">Módulos de Saúde</div>
                    </Card>

                    <Card className="p-6 text-center">
                        <Shield className="h-8 w-8 text-primary mx-auto mb-2"/>
                        <div className="text-2xl font-bold">98%</div>
                        <div className="text-sm text-muted-foreground">Prevenção Eficaz</div>
                    </Card>

                    <Card className="p-6 text-center">
                        <Star className="h-8 w-8 text-primary mx-auto mb-2"/>
                        <div className="text-2xl font-bold">4.9</div>
                        <div className="text-sm text-muted-foreground">Avaliação</div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
