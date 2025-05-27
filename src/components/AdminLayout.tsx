
import { Outlet, Navigate, Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, ShoppingCart, Tag, CreditCard, BarChart3, Settings, 
  Users, LogOut, Box, Package, Palette, FileText, MessageSquare, DollarSign, 
  ChartBar, UserPlus, Send, Bell, TrendingUp
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
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="border-r">
            <SidebarHeader className="border-b border-sidebar-border text-center">
              <div className="flex items-center justify-between p-4">
                <h3 className="font-bold text-lg">Kazi Kitchen Admin</h3>
                <div className="md:hidden">
                  <SidebarTrigger />
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link to="/admin/dashboard">
                      <LayoutDashboard className="mr-2" /> 
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Orders">
                    <Link to="/admin/orders">
                      <ShoppingCart className="mr-2" /> 
                      <span>Orders</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Products">
                    <Link to="/admin/products">
                      <Box className="mr-2" /> 
                      <span>Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Inventory">
                    <Link to="/admin/inventory">
                      <Package className="mr-2" /> 
                      <span>Inventory</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Marketing">
                    <Link to="/admin/marketing">
                      <BarChart3 className="mr-2" /> 
                      <span>Marketing</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Social Media">
                    <Link to="/admin/social-media">
                      <Send className="mr-2" /> 
                      <span>Social Media</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Customer Analytics">
                    <Link to="/admin/customer-analytics">
                      <TrendingUp className="mr-2" /> 
                      <span>Customer Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Notifications">
                    <Link to="/admin/notifications">
                      <MessageSquare className="mr-2" /> 
                      <span>Notifications</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Chat Management">
                    <Link to="/admin/chat-management">
                      <Bell className="mr-2" /> 
                      <span>Chat Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Offers">
                    <Link to="/admin/offers">
                      <Tag className="mr-2" /> 
                      <span>Offers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Payments">
                    <Link to="/admin/payments">
                      <CreditCard className="mr-2" /> 
                      <span>Payments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Expenses">
                    <Link to="/admin/expenses">
                      <DollarSign className="mr-2" /> 
                      <span>Expenses</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Reports">
                    <Link to="/admin/reports">
                      <ChartBar className="mr-2" /> 
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Site Design">
                    <Link to="/admin/site-design">
                      <Palette className="mr-2" /> 
                      <span>Site Design</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Customers">
                    <Link to="/admin/customers">
                      <Users className="mr-2" /> 
                      <span>Customers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Users">
                    <Link to="/admin/users">
                      <UserPlus className="mr-2" /> 
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link to="/admin/settings">
                      <Settings className="mr-2" /> 
                      <span>Settings</span>
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
          <main className="flex-1 w-full min-h-screen bg-gray-50 overflow-auto">
            <div className="md:hidden p-4 bg-white border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Kazi Kitchen Admin</h2>
              <SidebarTrigger />
            </div>
            <div className="p-4 md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export { AdminLayout, useAdminAuth };
