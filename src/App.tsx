import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
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
import CreatTrail from "./pages/admin/CreatTrail";
import CreatModule from "./pages/admin/CreatModule";
import EditTrail from "./pages/admin/EditTrail";
import CreatContent from "./pages/admin/CreatContent";
import AdminModuleDetails from "./pages/admin/ModuleDetails";
import EditModule from "./pages/admin/EditModule";
import LandingPage from "@/pages/LandingPage.tsx";
import {AuthProvider, useAuth} from "@/context/AuthContext";
import TutorDashboard from "@/pages/TutorDashboard";
import ConsultantDashboard from "@/pages/admin/ConsultantDashboard";
import ConsultantTrailDetails from "@/pages/admin/ConsultantTrailDetails";
import {ProtectedRoute, RoleRoute} from "@/routes/ProtectedRoute";

const queryClient = new QueryClient();

const RoleRedirect = () => {
    const {user} = useAuth();
    if (!user) return <Navigate to="/login" replace/>;
    return <Navigate to={user.role.toUpperCase() === "TUTOR" ? "/tutor" : user.role.toUpperCase() === "CONSULTOR" ? "/consultor" : "/"} replace/>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/me" element={<RoleRedirect />} />
              <Route element={<RoleRoute allow={["TUTOR", "CONSULTOR"]} />}> 
                <Route path="/tutor" element={<TutorDashboard />} />
                <Route path="/consultor" element={<ConsultantDashboard />} />
                <Route path="/consultor/trilhas/:id" element={<ConsultantTrailDetails />} />
              </Route>

              <Route path="/add-pet" element={<AddPet />} />
              <Route path="/edit-pet/:id" element={<EditPet />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/trails" element={<Trails />} />
              <Route path="/trail/:id" element={<TrailDetails />} />
              <Route path="/module/:trailId/:moduleId" element={<Module />} />
              <Route path="/quiz/:trailId/:moduleId" element={<Quiz />} />
              {/* Admin (Consultor) only */}
              <Route element={<RoleRoute allow={["CONSULTOR"]} />}>
                <Route path="/admin/create-trail" element={<CreatTrail />} />
                <Route path="/admin/create-module/:trailId" element={<CreatModule />} />
                <Route path="/admin/create-content/:trailId/:moduleId" element={<CreatContent />} />
                <Route path="/admin/edit-trail/:trailId" element={<EditTrail />} />
                <Route path="/admin/module/:trailId/:moduleId" element={<AdminModuleDetails />} />
                <Route path="/admin/edit-module/:trailId/:moduleId" element={<EditModule />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
