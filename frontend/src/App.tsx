import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/layouts/MainLayout";
import { AdminRoute } from "@/components/AdminRoute";
import Login from "@/pages/Login";
import BotPage from "@/pages/Bot";
import LogsPage from "@/pages/Logs";
import UsersPage from "@/pages/Users";
import GroupsPage from "@/pages/Groups";
import NotFound from "@/pages/NotFound";
import AdminAuth from "@/pages/AdminAuth";
import Overview from "@/pages/Overview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/bot" element={<BotPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route element={<AdminRoute />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/groups" element={<GroupsPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
