import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Inventory from "./pages/admin/Inventory";
import Marketing from "./pages/admin/Marketing";
import SocialMedia from "./pages/admin/SocialMedia";
import Notifications from "./pages/admin/Notifications";
import ChatManagement from "./pages/admin/ChatManagement";
import Offers from "./pages/admin/Offers";
import Payments from "./pages/admin/Payments";
import ExpenseManagement from "./pages/admin/ExpenseManagement";
import Reports from "./pages/admin/Reports";
import SiteDesign from "./pages/admin/SiteDesign";
import Customers from "./pages/admin/Customers";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";
import Invoice from "./pages/admin/Invoice";
import ServerAnalytics from "./pages/admin/ServerAnalytics";
import CustomerAnalytics from "./pages/admin/CustomerAnalytics";
import KitchenLogin from "./pages/kitchen/KitchenLogin";
import KitchenLayout from "./components/KitchenLayout";
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";
import KitchenPreparation from "./components/KitchenPreparation";
import RiderLogin from "./pages/rider/RiderLogin";
import RiderLayout from "./components/RiderLayout";
import RiderDashboard from "./pages/rider/RiderDashboard";
import RiderMap from "./pages/rider/RiderMap";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="track/:orderId" element={<OrderTracking />} />
            <Route path="invoice/:orderId" element={<Invoice />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="social-media" element={<SocialMedia />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="chat-management" element={<ChatManagement />} />
            <Route path="offers" element={<Offers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="expenses" element={<ExpenseManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="site-design" element={<SiteDesign />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customer-analytics" element={<CustomerAnalytics />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="server-analytics" element={<ServerAnalytics />} />
            <Route path="invoice/:id" element={<Invoice />} />
          </Route>
          
          {/* Kitchen Portal Routes */}
          <Route path="/kitchen/login" element={<KitchenLogin />} />
          <Route path="/kitchen" element={<KitchenLayout />}>
            <Route path="dashboard" element={<KitchenDashboard />} />
            <Route path="preparation" element={<KitchenPreparation />} />
          </Route>
          
          {/* Rider Portal Routes */}
          <Route path="/rider/login" element={<RiderLogin />} />
          <Route path="/rider" element={<RiderLayout />}>
            <Route path="dashboard" element={<RiderDashboard />} />
            <Route path="map" element={<RiderMap />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
