import { Outlet, Navigate, Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, ShoppingCart, Tag, CreditCard, BarChart3, Settings, 
  Users, LogOut, Box, Package, Palette, FileText, MessageSquare, DollarSign, 
  ChartBar, UserPlus, Send, Bell
} from "lucide-react";
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
                  <Link to="/admin/dashboard">
                    <LayoutDashboard className="mr-2" /> Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <Link to="/admin/orders">
                    <ShoppingCart className="mr-2" /> Orders
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Products">
                  <Link to="/admin/products">
                    <Box className="mr-2" /> Products
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Inventory">
                  <Link to="/admin/inventory">
                    <Package className="mr-2" /> Inventory
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Marketing">
                  <Link to="/admin/marketing">
                    <BarChart3 className="mr-2" /> Marketing
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Social Media">
                  <Link to="/admin/social-media">
                    <Send className="mr-2" /> Social Media
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Notifications">
                  <Link to="/admin/notifications">
                    <MessageSquare className="mr-2" /> Notifications
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Chat Management">
                  <Link to="/admin/chat-management">
                    <Bell className="mr-2" /> Chat Management
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Offers">
                  <Link to="/admin/offers">
                    <Tag className="mr-2" /> Offers
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Payments">
                  <Link to="/admin/payments">
                    <CreditCard className="mr-2" /> Payments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Expenses">
                  <Link to="/admin/expenses">
                    <DollarSign className="mr-2" /> Expenses
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reports">
                  <Link to="/admin/reports">
                    <ChartBar className="mr-2" /> Reports
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Site Design">
                  <Link to="/admin/site-design">
                    <Palette className="mr-2" /> Site Design
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Customers">
                  <Link to="/admin/customers">
                    <Users className="mr-2" /> Customers
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Users">
                  <Link to="/admin/users">
                    <UserPlus className="mr-2" /> Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/admin/settings">
                    <Settings className="mr-2" /> Settings
                  </Link>
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
