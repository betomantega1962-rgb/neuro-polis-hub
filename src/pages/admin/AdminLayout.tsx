import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminRoute } from "@/components/AdminRoute";

export const AdminLayout = () => {
  return (
    <AdminRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-12 flex items-center border-b border-border bg-card backdrop-blur-sm sticky top-0 z-40">
              <SidebarTrigger className="ml-2" />
            </header>
            <main className="flex-1 overflow-auto bg-background">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminRoute>
  );
};