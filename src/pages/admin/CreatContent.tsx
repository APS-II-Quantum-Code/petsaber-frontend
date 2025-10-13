import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, FileText, HelpCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";

interface ContentPage {
  id: string;
  title: string;
  content: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const CreateContent = () => {
  const { trailId, moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estado para conteúdo didático
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [currentPage, setCurrentPage] = useState({
    title: "",
    content: "",
  });

  // Estado para quiz
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: 0,
  });

  const handleAddPage = () => {
    if (!currentPage.title || !currentPage.content) {
      toast({
        title: "Erro",
        description: "Preencha o título e conteúdo da página",
        variant: "destructive",
      });
      return;
    }

    const newPage: ContentPage = {
      id: Math.random().toString(36).substring(7),
      title: currentPage.title,
      content: currentPage.content,
    };

    setPages([...pages, newPage]);
    setCurrentPage({ title: "", content: "" });

    toast({
      title: "Página adicionada!",
      description: "Continue adicionando mais páginas",
    });
  };

  const handleRemovePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const handleAddQuestion = () => {
    if (
      !currentQuestion.question ||
      !currentQuestion.option1 ||
      !currentQuestion.option2 ||
      !currentQuestion.option3 ||
      !currentQuestion.option4 ||
      currentQuestion.correctAnswer === 0
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos da questão",
        variant: "destructive",
      });
      return;
    }

    const newQuestion: Question = {
      id: Math.random().toString(36).substring(7),
      question: currentQuestion.question,
      options: [
        currentQuestion.option1,
        currentQuestion.option2,
        currentQuestion.option3,
        currentQuestion.option4,
      ],
      correctAnswer: currentQuestion.correctAnswer - 1,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: 0,
    });

    toast({
      title: "Questão adicionada!",
      description: "Continue adicionando mais questões",
    });
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = () => {
    if (pages.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma página de conteúdo",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma questão ao quiz",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Conteúdo salvo!",
      description: "Módulo criado com sucesso",
    });

    // Redireciona de volta para a área administrativa ou trilhas
    setTimeout(() => {
      navigate("/trails");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/admin/create-module/${trailId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Criar Conteúdo e Quiz</h1>
            </div>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                Conteúdo Didático
              </TabsTrigger>
              <TabsTrigger value="quiz" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            {/* Tab de Conteúdo Didático */}
            <TabsContent value="content" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Nova Página de Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle">Título da Página</Label>
                      <Input
                        id="pageTitle"
                        placeholder="Ex: História do Golden Retriever"
                        value={currentPage.title}
                        onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pageContent">Conteúdo</Label>
                      <Textarea
                        id="pageContent"
                        placeholder="Digite o conteúdo didático da página..."
                        value={currentPage.content}
                        onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                        rows={8}
                      />
                      <p className="text-xs text-muted-foreground">
                        Dica: Use ** para negrito e - para listas
                      </p>
                    </div>

                    <Button onClick={handleAddPage} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar Página
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {pages.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Páginas Adicionadas ({pages.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pages.map((page, index) => (
                        <div
                          key={page.id}
                          className="flex items-start justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex gap-4 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium mb-1">{page.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">{page.content}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePage(page.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab de Quiz */}
            <TabsContent value="quiz" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Nova Questão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Pergunta</Label>
                      <Textarea
                        id="question"
                        placeholder="Digite a pergunta do quiz..."
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="option1">Opção 1</Label>
                        <Input
                          id="option1"
                          placeholder="Primeira alternativa"
                          value={currentQuestion.option1}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option1: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="option2">Opção 2</Label>
                        <Input
                          id="option2"
                          placeholder="Segunda alternativa"
                          value={currentQuestion.option2}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option2: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="option3">Opção 3</Label>
                        <Input
                          id="option3"
                          placeholder="Terceira alternativa"
                          value={currentQuestion.option3}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option3: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="option4">Opção 4</Label>
                        <Input
                          id="option4"
                          placeholder="Quarta alternativa"
                          value={currentQuestion.option4}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option4: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="correctAnswer">Resposta Correta</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((num) => (
                          <Button
                            key={num}
                            type="button"
                            variant={currentQuestion.correctAnswer === num ? "default" : "outline"}
                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: num })}
                          >
                            Opção {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleAddQuestion} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar Questão
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {questions.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Questões Adicionadas ({questions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questions.map((q, index) => (
                        <div
                          key={q.id}
                          className="flex items-start justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex gap-4 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium mb-2">{q.question}</p>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                {q.options.map((opt, i) => (
                                  <p
                                    key={i}
                                    className={i === q.correctAnswer ? "text-primary font-medium" : ""}
                                  >
                                    {i + 1}. {opt} {i === q.correctAnswer && "✓"}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Botão de Salvar (sempre visível) */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <Button onClick={handleSave} className="w-full gap-2" size="lg">
                <Save className="h-5 w-5" />
                Salvar Módulo Completo
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                Páginas: {pages.length} | Questões: {questions.length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;