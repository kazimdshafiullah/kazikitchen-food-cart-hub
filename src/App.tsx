
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import FrozenFood from "./pages/FrozenFood";
import WeekendMenu from "./pages/WeekendMenu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import ProductDetail from "./pages/ProductDetail";
import WeekendOrder from "./pages/WeekendOrder";
import FrozenFoodOrder from "./pages/FrozenFoodOrder";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Customer pages
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Customers from "./pages/admin/Customers";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import UserManagement from "./pages/admin/UserManagement";
import MenuManagement from "./pages/admin/MenuManagement";
import SubCategories from "./pages/admin/SubCategories";
import Inventory from "./pages/admin/Inventory";
import CustomerAnalytics from "./pages/admin/CustomerAnalytics";
import ExpenseManagement from "./pages/admin/ExpenseManagement";
import Marketing from "./pages/admin/Marketing";
import SocialMedia from "./pages/admin/SocialMedia";
import ChatManagement from "./pages/admin/ChatManagement";
import Notifications from "./pages/admin/Notifications";
import SiteDesign from "./pages/admin/SiteDesign";
import Invoice from "./pages/admin/Invoice";
import Offers from "./pages/admin/Offers";
import Payments from "./pages/admin/Payments";
import ServerAnalytics from "./pages/admin/ServerAnalytics";

// Kitchen pages
import KitchenLogin from "./pages/kitchen/KitchenLogin";
import KitchenLayout from "./components/KitchenLayout";
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";

// Rider pages
import RiderLogin from "./pages/rider/RiderLogin";
import RiderLayout from "./components/RiderLayout";
import RiderDashboard from "./pages/rider/RiderDashboard";
import RiderMap from "./pages/rider/RiderMap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with main layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="frozen-food" element={<FrozenFood />} />
            <Route path="weekend-menu" element={<WeekendMenu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-tracking" element={<OrderTracking />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="weekend-order" element={<WeekendOrder />} />
            <Route path="frozen-food-order" element={<FrozenFoodOrder />} />
            <Route path="reset-password" element={<ResetPassword />} />
            
            {/* Customer routes */}
            <Route path="customer-login" element={<CustomerLogin />} />
            <Route path="customer-dashboard" element={<CustomerDashboard />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="menu-management" element={<MenuManagement />} />
            <Route path="sub-categories" element={<SubCategories />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customer-analytics" element={<CustomerAnalytics />} />
            <Route path="expense-management" element={<ExpenseManagement />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="social-media" element={<SocialMedia />} />
            <Route path="chat-management" element={<ChatManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="site-design" element={<SiteDesign />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="offers" element={<Offers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="server-analytics" element={<ServerAnalytics />} />
          </Route>

          {/* Kitchen routes */}
          <Route path="/kitchen/login" element={<KitchenLogin />} />
          <Route path="/kitchen" element={<KitchenLayout />}>
            <Route index element={<KitchenDashboard />} />
          </Route>

          {/* Rider routes */}
          <Route path="/rider/login" element={<RiderLogin />} />
          <Route path="/rider" element={<RiderLayout />}>
            <Route index element={<RiderDashboard />} />
            <Route path="map" element={<RiderMap />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
