import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Tag, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Home,
  Shield,
  Play
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import abnpLogo from "@/assets/abnp-logo.png";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    exact: true
  },
  {
    title: "Usuários",
    url: "/admin/usuarios",
    icon: Users
  },
  {
    title: "Cursos",
    url: "/admin/cursos",
    icon: BookOpen
  },
  {
    title: "Aulas",
    url: "/admin/aulas",
    icon: Play
  },
  {
    title: "Artigos",
    url: "/admin/artigos",
    icon: FileText
  },
  {
    title: "Ofertas",
    url: "/admin/ofertas",
    icon: Tag
  }
];

const marketingMenuItems = [
  {
    title: "Campanhas Email",
    url: "/admin/campanhas",
    icon: Mail
  },
  {
    title: "Mensagens",
    url: "/admin/mensagens",
    icon: MessageSquare
  }
];

const systemMenuItems = [
  {
    title: "Roles & Permissões",
    url: "/admin/roles",
    icon: Shield
  },
  {
    title: "Configurações",
    url: "/admin/configuracoes",
    icon: Settings
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string, exact = false) => {
    const active = isActive(path, exact);
    return active 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <img 
            src={abnpLogo} 
            alt="ABNP Logo" 
            className="h-8 w-8 object-contain flex-shrink-0" 
          />
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-primary">
                Admin ABNP
              </h2>
              <p className="text-xs text-sidebar-foreground/70">
                Painel Administrativo
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Acesso Rápido</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className="flex items-center gap-2 p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Ver Site</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/curso-gratuito"
                    className="flex items-center gap-2 p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    {!collapsed && <span>Curso Gratuito</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Admin Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Marketing Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketingMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="h-4 w-4 mr-2" />
          {!collapsed && "Sair do Admin"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}