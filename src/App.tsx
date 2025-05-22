
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

// Admin Pages
import { AdminLayout, useAdminAuth } from "./components/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Inventory from "./pages/admin/Inventory";
import Marketing from "./pages/admin/Marketing";
import Offers from "./pages/admin/Offers";
import Payments from "./pages/admin/Payments";
import Customers from "./pages/admin/Customers";
import SiteDesign from "./pages/admin/SiteDesign";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Store Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/marketing" element={<Marketing />} />
            <Route path="/admin/offers" element={<Offers />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/site-design" element={<SiteDesign />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route index element={<Dashboard />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
