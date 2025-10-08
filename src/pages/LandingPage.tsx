import Header from "@/components/layout/Header.tsx";
import {Dashboard} from "@/components/landingPage/Dashboard.tsx";
import {LearningPaths} from "@/components/landingPage/LearningPaths.tsx";
import {Gamification} from "@/components/landingPage/Gamefication.tsx";
import {Hero} from "@/components/landingPage/Hero.tsx";

const LandingPage = () => {

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-16 mt-20">
                <Hero/>
                <Dashboard/>
                <LearningPaths/>
                <Gamification/>
            </main>
        </div>
    );
};

export default LandingPage;
