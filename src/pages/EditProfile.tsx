import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, IdCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { TutorAPI } from "@/lib/api";

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    nome: user?.nome ?? "",
    cpf: "",
    email: user?.email ?? "",
  });

  const [passwordData, setPasswordData] = useState({
    atual: "",
    nova: "",
    confirmar: "",
  });

  // Carrega dados reais do backend (/tutor/meus-dados) ao montar
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await TutorAPI.meusDados<{
          idTutor: number;
          nome: string;
          cpf: string;
          email: string;
          senha: string;
        }>(token);
        if (!mounted || !resp) return;
        setFormData({
          nome: resp.nome ?? "",
          cpf: resp.cpf ?? "",
          email: resp.email ?? "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Atualizar perfil:", formData);
    toast({ title: "Perfil atualizado!", description: "Suas informações foram atualizadas com sucesso." });
    setTimeout(() => navigate("/me"), 800);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.nova !== passwordData.confirmar) {
      toast({ title: "Senhas não conferem", description: "A confirmação deve ser igual à nova senha.", variant: "destructive" });
      return;
    }
    if (!passwordData.atual || !passwordData.nova) {
      toast({ title: "Campos obrigatórios", description: "Preencha a senha atual e a nova senha.", variant: "destructive" });
      return;
    }
    console.log("Alterar senha:", { ...passwordData, confirmar: undefined });
    toast({ title: "Senha atualizada!", description: "Sua senha foi alterada com sucesso." });
    setPasswordData({ atual: "", nova: "", confirmar: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/me">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-primary" />
                Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-10"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      className="pl-10"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
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

          {/* alterar Senha */}
          <Card className="shadow-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lock className="h-5 w-5 text-primary" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="senha-atual"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={passwordData.atual}
                      onChange={(e) => setPasswordData({ ...passwordData, atual: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nova-senha">Nova senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nova-senha"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={passwordData.nova}
                        onChange={(e) => setPasswordData({ ...passwordData, nova: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmar-senha"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={passwordData.confirmar}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })}
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
  );
};

export default EditProfile;