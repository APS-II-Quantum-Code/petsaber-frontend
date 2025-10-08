import Header from "@/components/layout/Header";

const TutorDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <main className="container py-8 space-y-8">
        <h1 className="text-2xl font-bold">Dashboard do Tutor</h1>
        <p className="text-muted-foreground">Conteúdos e funcionalidades para tutores.</p>
      </main>
    </div>
  );
};

export default TutorDashboard;
