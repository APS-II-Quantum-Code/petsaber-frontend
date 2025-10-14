import { Link } from "react-router-dom";
import { Plus, BookOpen, List } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ConsultantDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="container py-8 space-y-8">
<div>
          <h1 className="text-3xl font-bold mb-2">Dashboard do Consultor</h1>
          <p className="text-muted-foreground">Gerencie trilhas de aprendizado e conteúdos educacionais</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Criar Nova Trilha</CardTitle>
                  <CardDescription>Crie trilhas de aprendizado personalizadas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/admin/create-trail">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Trilha
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <List className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Trilhas Existentes</CardTitle>
                  <CardDescription>Visualize e gerencie trilhas criadas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/trails">
                <Button variant="outline" className="w-full gap-2">
                  <BookOpen className="h-4 w-4" />
                  Ver Trilhas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ConsultantDashboard;
