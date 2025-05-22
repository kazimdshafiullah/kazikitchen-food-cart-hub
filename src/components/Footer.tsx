
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-kazi-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-kazi-orange">Kazi</span>
              <span className="text-2xl font-bold text-kazi-light-green">Kitchen</span>
            </Link>
            <p className="mt-2 text-sm text-gray-300">
              Delicious food delivered to your doorstep. We make food with passion.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/#categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/checkout" className="text-gray-300 hover:text-white transition-colors">Checkout</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/?category=frozen-food" className="text-gray-300 hover:text-white transition-colors">Frozen Food</Link></li>
              <li><Link to="/?category=breakfast" className="text-gray-300 hover:text-white transition-colors">Breakfast</Link></li>
              <li><Link to="/?category=children-tiffin" className="text-gray-300 hover:text-white transition-colors">Children's Tiffin</Link></li>
              <li><Link to="/?category=desserts" className="text-gray-300 hover:text-white transition-colors">Desserts</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>123 Food Street</p>
              <p>Cuisine City, FK 12345</p>
              <p className="mt-2">Email: info@kazikitchen.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} KaziKitchen. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
