
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/77069bdb-027f-4261-9fa3-ff448ba1a6df.png" 
                alt="Kazi Kitchen Logo" 
                className="h-12 w-auto mr-3"
              />
            </Link>
            <p className="mt-2 text-sm text-amber-200">
              Delicious food delivered to your doorstep. We make food with passion.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-amber-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/frozen-food" className="text-amber-200 hover:text-white transition-colors">Frozen Food</Link></li>
              <li><Link to="/weekend-menu" className="text-amber-200 hover:text-white transition-colors">Weekend Menu</Link></li>
              <li><Link to="/cart" className="text-amber-200 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-300">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/frozen-food" className="text-amber-200 hover:text-white transition-colors">Frozen Food</Link></li>
              <li><Link to="/weekend-menu" className="text-amber-200 hover:text-white transition-colors">School Tiffin</Link></li>
              <li><Link to="/weekend-menu" className="text-amber-200 hover:text-white transition-colors">Office Food</Link></li>
              <li><Link to="/weekend-menu" className="text-amber-200 hover:text-white transition-colors">Weekly Plans</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-orange-300">Contact Us</h3>
            <address className="not-italic text-amber-200">
              <p>Dhaka, Bangladesh</p>
              <p className="mt-2">Email: info@kazikitchen.com</p>
              <p>Phone: +880 1234-567890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-amber-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-amber-300">© {new Date().getFullYear()} Kazi Kitchen. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
