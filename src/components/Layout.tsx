
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LiveChat from "./LiveChat";
import { CartProvider } from "@/context/CartContext";

const Layout = () => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <LiveChat />
      </div>
    </CartProvider>
  );
};

export default Layout;
