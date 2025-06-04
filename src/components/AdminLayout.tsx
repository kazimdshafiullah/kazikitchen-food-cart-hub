import { Outlet, Navigate, Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, ShoppingCart, Tag, CreditCard, BarChart3, Settings, 
  Users, LogOut, Box, Package, Palette, FileText, MessageSquare, DollarSign, 
  ChartBar, UserPlus, Send, Bell, TrendingUp, MenuIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = () => {
  const { user, logout, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="border-r bg-white">
            <SidebarHeader className="border-b border-sidebar-border text-center bg-white">
              <div className="flex items-center justify-between p-4">
                <h3 className="font-bold text-lg text-gray-900">Kazi Kitchen Admin</h3>
                <div className="md:hidden">
                  <SidebarTrigger />
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-white">
              <SidebarMenu>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link to="/admin/dashboard" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <LayoutDashboard className="mr-2" /> 
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Orders">
                    <Link to="/admin/orders" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <ShoppingCart className="mr-2" /> 
                      <span>Orders</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Products">
                    <Link to="/admin/products" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Box className="mr-2" /> 
                      <span>Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Menu Management">
                    <Link to="/admin/menu-management" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <MenuIcon className="mr-2" /> 
                      <span>Menu Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Inventory">
                    <Link to="/admin/inventory" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Package className="mr-2" /> 
                      <span>Inventory</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Marketing">
                    <Link to="/admin/marketing" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <BarChart3 className="mr-2" /> 
                      <span>Marketing</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Social Media">
                    <Link to="/admin/social-media" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Send className="mr-2" /> 
                      <span>Social Media</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Customer Analytics">
                    <Link to="/admin/customer-analytics" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <TrendingUp className="mr-2" /> 
                      <span>Customer Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Notifications">
                    <Link to="/admin/notifications" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <MessageSquare className="mr-2" /> 
                      <span>Notifications</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Chat Management">
                    <Link to="/admin/chat-management" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Bell className="mr-2" /> 
                      <span>Chat Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Offers">
                    <Link to="/admin/offers" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Tag className="mr-2" /> 
                      <span>Offers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Payments">
                    <Link to="/admin/payments" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <CreditCard className="mr-2" /> 
                      <span>Payments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Expenses">
                    <Link to="/admin/expenses" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <DollarSign className="mr-2" /> 
                      <span>Expenses</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Reports">
                    <Link to="/admin/reports" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <ChartBar className="mr-2" /> 
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Site Design">
                    <Link to="/admin/site-design" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Palette className="mr-2" /> 
                      <span>Site Design</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Customers">
                    <Link to="/admin/customers" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Users className="mr-2" /> 
                      <span>Customers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Users">
                    <Link to="/admin/users" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <UserPlus className="mr-2" /> 
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link to="/admin/settings" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                      <Settings className="mr-2" /> 
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <div className="mt-auto p-4 border-t border-sidebar-border bg-white">
              <div className="text-sm text-gray-600 mb-2">
                Logged in as: <strong>{user.username}</strong>
              </div>
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

export { AdminLayout };
