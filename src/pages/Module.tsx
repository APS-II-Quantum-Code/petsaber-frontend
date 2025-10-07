import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";

const Module = () => {
  const { trailId, moduleId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - seria buscado baseado no trailId e moduleId
  const moduleData = {
    title: "Fundamentos da Raça",
    level: "Básico",
    totalPages: 3,
    content: [
      {
        page: 1,
        title: "História do Golden Retriever",
        content: `O Golden Retriever é uma raça de cães de médio a grande porte, originária da Escócia no século XIX. 
        
Desenvolvida por Dudley Marjoribanks, 1º Barão de Tweedmouth, a raça foi criada através do cruzamento cuidadoso de Retrievers amarelos com Tweed Water Spaniels (agora extintos).

**Características principais:**
- Inteligente e amigável
- Ótimo com crianças
- Excelente cão de família
- Adora água e atividades ao ar livre
- Pelagem dourada característica

O Golden Retriever foi reconhecido pelo Kennel Club britânico em 1911 e rapidamente se tornou uma das raças mais populares do mundo.`,
      },
      {
        page: 2,
        title: "Temperamento e Personalidade",
        content: `Os Golden Retrievers são conhecidos por seu temperamento excepcionalmente dócil e amigável.

**Principais características comportamentais:**
- **Sociabilidade**: Adora estar perto de pessoas e outros animais
- **Inteligência**: Facilmente treinável, uma das raças mais inteligentes
- **Energia**: Nível alto de energia, precisa de exercícios diários
- **Lealdade**: Extremamente leal à família
- **Paciência**: Tolera bem crianças pequenas

Esses cães foram criados para trabalhar junto aos humanos, o que explica sua natureza cooperativa. Eles se destacam em:
- Terapia assistida
- Cães-guia
- Busca e resgate
- Competições de obediência`,
      },
      {
        page: 3,
        title: "Necessidades de Socialização",
        content: `A socialização adequada é crucial para o desenvolvimento saudável de um Golden Retriever.

**Período crítico:** Entre 3 e 14 semanas de idade

**Aspectos importantes da socialização:**

1. **Exposição a diferentes ambientes**
   - Parques, ruas movimentadas, ambientes internos
   - Diferentes tipos de pisos e superfícies

2. **Interação com pessoas diversas**
   - Adultos, crianças, idosos
   - Pessoas com diferentes aparências

3. **Contato com outros animais**
   - Outros cães de diversos portes
   - Gatos e outros pets domésticos

4. **Experiências positivas**
   - Sempre associar novidades com recompensas
   - Manter as interações calmas e positivas

Uma socialização adequada resulta em um cão confiante, equilibrado e feliz!`,
      },
    ],
  };

  const progress = (currentPage / moduleData.totalPages) * 100;

  const handleNext = () => {
    if (currentPage < moduleData.totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate(`/quiz/${trailId}/${moduleId}`);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Básico":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Intermediário":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Avançado":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      default:
        return "bg-muted";
    }
  };

  const currentContent = moduleData.content[currentPage - 1];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/trail/${trailId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{moduleData.title}</CardTitle>
                </div>
                <Badge variant="outline" className={getLevelColor(moduleData.level)}>
                  {moduleData.level}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso do módulo</span>
                  <span className="font-medium">
                    Página {currentPage} de {moduleData.totalPages}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{currentContent.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                {currentContent.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                    return (
                      <h3 key={index} className="font-semibold text-lg mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.trim().startsWith('-')) {
                    return (
                      <li key={index} className="ml-4 mb-1">
                        {paragraph.replace(/^-\s*/, '')}
                      </li>
                    );
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-3 text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  }
                  return <br key={index} />;
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            <Button onClick={handleNext} className="gap-2">
              {currentPage === moduleData.totalPages ? "Ir para Quiz" : "Próxima"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module;