
import React from "react";
import { Link } from "react-router-dom";
import { useStoreSettings } from "@/hooks/useStoreSettings";

const Footer = () => {
  const { settings: storeSettings, isLoading } = useStoreSettings();

  if (isLoading) {
    return (
      <footer className="bg-orange-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-4 bg-orange-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-orange-700 rounded w-1/3"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-orange-800 text-white py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/b2259b6e-c2d4-4685-a56f-95379cddaf8f.png" 
                alt="Kazi Kitchen Logo" 
                className="h-24 w-auto mr-4"
              />
            </Link>
            <p className="mt-3 text-sm text-orange-200 leading-relaxed">
              {storeSettings.description || "Delicious food delivered to your doorstep. We make food with passion."}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-orange-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/frozen-food" className="text-orange-200 hover:text-white transition-colors">Frozen Food</Link></li>
              <li><Link to="/weekend-menu" className="text-orange-200 hover:text-white transition-colors">Weekend Menu</Link></li>
              <li><Link to="/cart" className="text-orange-200 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-300">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/frozen-food" className="text-orange-200 hover:text-white transition-colors">Frozen Food</Link></li>
              <li><Link to="/weekend-menu" className="text-orange-200 hover:text-white transition-colors">School Tiffin</Link></li>
              <li><Link to="/weekend-menu" className="text-orange-200 hover:text-white transition-colors">Office Food</Link></li>
              <li><Link to="/weekend-menu" className="text-orange-200 hover:text-white transition-colors">Weekly Plans</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-300">Contact Us</h3>
            <address className="not-italic text-orange-200">
              <p>{storeSettings.address}</p>
              <p className="mt-2">Email: {storeSettings.email}</p>
              <p>Phone: {storeSettings.phone}</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-orange-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-orange-300">© {new Date().getFullYear()} {storeSettings.name}. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li><a href="#" className="text-orange-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-orange-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
