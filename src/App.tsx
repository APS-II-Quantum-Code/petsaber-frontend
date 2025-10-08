import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddPet from "./pages/AddPet";
import EditPet from "./pages/EditPet";
import EditProfile from "./pages/EditProfile";
import AccountInfo from "./pages/AccountInfo";
import Trails from "./pages/Trails";
import TrailDetails from "./pages/TrailDetails";
import Module from "./pages/Module";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import LandingPage from "@/pages/LandingPage.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster/>
            <Sonner/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/home" element={<Index/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/add-pet" element={<AddPet/>}/>
                    <Route path="/edit-pet/:id" element={<EditPet/>}/>
                    <Route path="/edit-profile" element={<EditProfile/>}/>
                    <Route path="/account-info" element={<AccountInfo/>}/>
                    <Route path="/trails" element={<Trails/>}/>
                    <Route path="/trail/:id" element={<TrailDetails/>}/>
                    <Route path="/module/:trailId/:moduleId" element={<Module/>}/>
                    <Route path="/quiz/:trailId/:moduleId" element={<Quiz/>}/>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
