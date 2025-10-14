import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FreeCourse from "./pages/FreeCourse";
import CoursesGallery from "./pages/CoursesGallery";
import CourseView from "./pages/CourseView";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Privacy from "./pages/Privacy";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminCourses } from "./pages/admin/AdminCourses";
import { AdminLessons } from "./pages/admin/AdminLessons";
import { AdminArticles } from "./pages/admin/AdminArticles";
import { AdminOffers } from "./pages/admin/AdminOffers";
import { AdminCampaigns } from "./pages/admin/AdminCampaigns";
import { AdminMessages } from "./pages/admin/AdminMessages";
import { AdminSettings } from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/curso-gratuito" element={<FreeCourse />} />
            <Route path="/cursos" element={<CoursesGallery />} />
            <Route path="/cursos/:courseId" element={<CourseView />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacidade" element={<Privacy />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="cursos" element={<AdminCourses />} />
              <Route path="aulas" element={<AdminLessons />} />
              <Route path="artigos" element={<AdminArticles />} />
              <Route path="ofertas" element={<AdminOffers />} />
              <Route path="campanhas" element={<AdminCampaigns />} />
              <Route path="mensagens" element={<AdminMessages />} />
              <Route path="configuracoes" element={<AdminSettings />} />
              <Route path="roles" element={<AdminUsers />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
