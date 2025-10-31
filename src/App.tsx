import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { ServiceLineSwitcher } from "@/components/ServiceLineSwitcher";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ServiceLineSelection from "./pages/ServiceLineSelection";
import HCPList from "./pages/HCPList";
import HCOList from "./pages/HCOList";
import AddressList from "./pages/AddressList";
import DCRList from "./pages/DCRList";
import ChangeRequestList from "./pages/ChangeRequestList";
import DataChangeRequests from "./pages/DataChangeRequests";
import TopAgencies from "./pages/TopAgencies";
import AdminApprovalDashboard from "./pages/AdminApprovalDashboard";
import RulesManagement from "./pages/RulesManagement";
import MergeMatchApproval from "./pages/MergeMatchApproval";
import DataChangeRequestDetail from "./pages/DataChangeRequestDetail";
import HCPDetail from "./pages/HCPDetail";
import HCODetail from "./pages/HCODetail";
import AddressDetail from "./pages/AddressDetail";
import DCRDetail from "./pages/DCRDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/select-service-line" 
            element={
              <ProtectedRoute>
                <ServiceLineSelection />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex h-14 items-center px-4 gap-4">
                          <SidebarTrigger />
                          <span className="text-xl font-bold">OneSky</span>
                          <div className="flex-1" />
                          <ServiceLineSwitcher />
                          <RoleSwitcher />
                        </div>
                      </header>
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/top-agencies" element={<TopAgencies />} />
                          <Route path="/hcp" element={<HCPList />} />
                          <Route path="/hco" element={<HCOList />} />
                          <Route path="/address" element={<AddressList />} />
                          <Route path="/dcr" element={<DCRList />} />
                          <Route path="/change-requests" element={<DataChangeRequests />} />
                          <Route path="/change-requests/:status" element={<DataChangeRequests />} />
                          <Route path="/admin/approvals" element={<AdminApprovalDashboard />} />
                          <Route path="/rules" element={<RulesManagement />} />
                          <Route path="/merge-match-approval" element={<MergeMatchApproval />} />
                          <Route path="/data-change-requests" element={<ChangeRequestList />} />
                          <Route path="/data-change-requests/:id" element={<DataChangeRequestDetail />} />
                          <Route path="/hcp/:id" element={<HCPDetail />} />
                          <Route path="/hco/:id" element={<HCODetail />} />
                          <Route path="/address/:id" element={<AddressDetail />} />
                          <Route path="/dcr/:id" element={<DCRDetail />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
