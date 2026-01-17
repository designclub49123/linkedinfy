import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ThemeInitializer from "@/components/ThemeInitializer";

// Pages
import LandingPage from "./components/ui/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Billing from "./pages/Billing";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import UsageAnalytics from "./pages/UsageAnalytics";
import HelpSupport from "./pages/HelpSupport";

// Auth Pages
import AuthPage from "./pages/auth/AuthPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Onboarding Pages
import OnboardingWelcome from "./pages/onboarding/Welcome";
import OnboardingChoosePlan from "./pages/onboarding/ChoosePlan";
import OnboardingProfileSetup from "./pages/onboarding/ProfileSetup";
import OnboardingWorkspaceSetup from "./pages/onboarding/WorkspaceSetup";

// AI Tools
import WritingAssistant from "./pages/ai/WritingAssistant";
import GrammarCheck from "./pages/ai/GrammarCheck";
import AllAITools from "./pages/ai/AllTools";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Public Route - redirects authenticated users to dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Auth Pages */}
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      
      {/* Onboarding (Protected) */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingWelcome /></ProtectedRoute>} />
      <Route path="/onboarding/plan" element={<ProtectedRoute><OnboardingChoosePlan /></ProtectedRoute>} />
      <Route path="/onboarding/profile" element={<ProtectedRoute><OnboardingProfileSetup /></ProtectedRoute>} />
      <Route path="/onboarding/workspace" element={<ProtectedRoute><OnboardingWorkspaceSetup /></ProtectedRoute>} />
      
      {/* Dashboard & App (Protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/app" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/editor/:id" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><UsageAnalytics /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
      
      {/* AI Tools (Protected) */}
      <Route path="/ai/all-tools" element={<ProtectedRoute><AllAITools /></ProtectedRoute>} />
      <Route path="/ai/writing-assistant" element={<ProtectedRoute><WritingAssistant /></ProtectedRoute>} />
      <Route path="/ai/grammar-check" element={<ProtectedRoute><GrammarCheck /></ProtectedRoute>} />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeInitializer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
