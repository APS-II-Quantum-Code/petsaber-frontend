import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";

const Quiz = () => {
  const { trailId, moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock data - perguntas baseadas no nível do módulo
  const quizData = {
    title: "Quiz - Fundamentos da Raça",
    level: "Básico",
    questions: [
      {
        id: 1,
        question: "Onde o Golden Retriever foi originalmente desenvolvido?",
        options: [
          "Inglaterra",
          "Escócia",
          "Irlanda",
          "País de Gales"
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Qual é uma característica marcante do temperamento do Golden Retriever?",
        options: [
          "Agressividade territorial",
          "Independência extrema",
          "Amigável e sociável",
          "Desconfiança com estranhos"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Qual é o período crítico de socialização para filhotes?",
        options: [
          "1 a 2 semanas",
          "3 a 14 semanas",
          "4 a 6 meses",
          "Após 1 ano"
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Para que tipo de trabalho os Golden Retrievers foram originalmente criados?",
        options: [
          "Pastoreio de ovelhas",
          "Guarda de propriedades",
          "Caça e recuperação de aves",
          "Trenós de neve"
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "Qual NÃO é uma característica comum dos Golden Retrievers?",
        options: [
          "Alta inteligência",
          "Amor por água",
          "Tendência ao isolamento",
          "Facilidade de treinamento"
        ],
        correctAnswer: 2,
      },
    ],
  };

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const currentQ = quizData.questions[currentQuestion];

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinish = () => {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;
    
    if (percentage >= 70) {
      toast({
        title: "Parabéns! 🎉",
        description: `Você acertou ${score} de ${quizData.questions.length} questões!`,
      });
    } else {
      toast({
        title: "Continue tentando! 💪",
        description: `Você acertou ${score} de ${quizData.questions.length} questões. Revise o material e tente novamente.`,
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      navigate(`/trail/${trailId}`);
    }, 2000);
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

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-card text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {passed ? (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-12 w-12 text-primary" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <XCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-3xl mb-2">
                  {passed ? "Parabéns!" : "Quase lá!"}
                </CardTitle>
                <p className="text-muted-foreground">
                  {passed 
                    ? "Você completou o módulo com sucesso!" 
                    : "Continue estudando e tente novamente."}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-6xl font-bold text-primary mb-2">
                    {score}/{quizData.questions.length}
                  </div>
                  <p className="text-muted-foreground">Questões corretas</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Aproveitamento</span>
                    <span className="font-medium">{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={percentage} />
                </div>

                <div className="space-y-3 pt-4">
                  {quizData.questions.map((question, index) => (
                    <div 
                      key={question.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 text-left"
                    >
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                      <span className="text-sm">{question.question}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setSelectedAnswers([]);
                    }}
                  >
                    Tentar Novamente
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleFinish}
                  >
                    Voltar para Trilha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
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
                <CardTitle className="text-2xl">{quizData.title}</CardTitle>
                <Badge variant="outline" className={getLevelColor(quizData.level)}>
                  {quizData.level}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">
                    Questão {currentQuestion + 1} de {quizData.questions.length}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === quizData.questions.length - 1 ? "Finalizar" : "Próxima"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;