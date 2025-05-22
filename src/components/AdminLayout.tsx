
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingCart, Tag, CreditCard, BarChart3, Settings, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Simple mock auth for demo purposes
// In a real app, this would be replaced with proper authentication
const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("adminAuthenticated") === "true";
  });

  const login = (password: string) => {
    // Demo only - in production, use proper authentication
    if (password === "admin123") {
      localStorage.setItem("adminAuthenticated", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border text-center">
            <h3 className="font-bold text-lg p-4">Kazi Kitchen Admin</h3>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <a href="/admin/dashboard">
                    <LayoutDashboard className="mr-2" /> Dashboard
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <a href="/admin/orders">
                    <ShoppingCart className="mr-2" /> Orders
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Marketing">
                  <a href="/admin/marketing">
                    <BarChart3 className="mr-2" /> Marketing
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Offers">
                  <a href="/admin/offers">
                    <Tag className="mr-2" /> Offers
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Payments">
                  <a href="/admin/payments">
                    <CreditCard className="mr-2" /> Payments
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Customers">
                  <a href="/admin/customers">
                    <Users className="mr-2" /> Customers
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <a href="/admin/settings">
                    <Settings className="mr-2" /> Settings
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </Sidebar>
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export { AdminLayout, useAdminAuth };
