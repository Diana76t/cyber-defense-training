import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Tips from "./pages/Tips";
import Lab from "./pages/Lab";
import ScenarioPage from "./pages/ScenarioPage";
import Leaderboard from "./pages/Leaderboard";
import IncidentLab from "./pages/IncidentLab";
import IncidentPage from "./pages/IncidentPage";
import SocAlertLab from "./pages/SocAlertLab";
import SocAlertPage from "./pages/SocAlertPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/lab/:scenarioId" element={<ScenarioPage />} />
          <Route path="/incident" element={<IncidentLab />} />
          <Route path="/incident/:incidentId" element={<IncidentPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
