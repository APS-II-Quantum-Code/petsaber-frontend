import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";

const AccountInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Informações da Conta</h1>
          </div>

          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Mail className="h-5 w-5 text-primary" />
                  Dados da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium">joao.silva@email.com</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nome de usuário</p>
                  <p className="font-medium">joaosilva</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  Informações de Cadastro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Membro desde</p>
                  <p className="font-medium">15 de março de 2024</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Último acesso</p>
                  <p className="font-medium">Hoje às 14:30</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Award className="h-5 w-5 text-primary" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de pontos</p>
                  <p className="font-medium">1.250 pts</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trilhas concluídas</p>
                  <p className="font-medium">1 de 3</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pets cadastrados</p>
                  <p className="font-medium">3 pets</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5 text-primary" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;