
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Search, Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSubCategoryClick = (subcategoryType: string) => {
    document.getElementById('weekend-order-menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-kazi-red">Kazi</span>
            <span className="text-2xl font-bold text-kazi-green">Kitchen</span>
          </Link>
          
          {/* Search - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full flex">
              <Input
                type="text"
                placeholder="Search for foods..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" size="icon" type="submit" className="ml-1">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-kazi-orange transition-colors duration-200">Home</Link>
            <Link to="/#categories" className="hover:text-kazi-orange transition-colors duration-200">Categories</Link>
            
            {/* Weekend Order Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:text-kazi-orange transition-colors duration-200 flex items-center gap-1">
                  Weekend Order Menu
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem
                  onClick={() => handleSubCategoryClick('school-tiffin')}
                  className="cursor-pointer"
                >
                  School Tiffin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSubCategoryClick('office-food')}
                  className="cursor-pointer"
                >
                  Office Food
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-kazi-dark hover:text-kazi-orange transition-colors duration-200" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-kazi-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-4">
              <ShoppingCart className="h-6 w-6 text-kazi-dark" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-kazi-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-kazi-dark focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t">
            <form onSubmit={handleSearch} className="mb-4 flex">
              <Input
                type="text"
                placeholder="Search for foods..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" size="icon" type="submit" className="ml-1">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Link 
              to="/" 
              className="block py-2 hover:text-kazi-orange transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/#categories" 
              className="block py-2 hover:text-kazi-orange transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <div className="py-2">
              <span className="block font-medium text-gray-900 mb-2">Weekend Order Menu</span>
              <button
                onClick={() => {
                  handleSubCategoryClick('school-tiffin');
                  setMobileMenuOpen(false);
                }}
                className="block pl-4 py-1 text-gray-600 hover:text-kazi-orange transition-colors duration-200"
              >
                School Tiffin
              </button>
              <button
                onClick={() => {
                  handleSubCategoryClick('office-food');
                  setMobileMenuOpen(false);
                }}
                className="block pl-4 py-1 text-gray-600 hover:text-kazi-orange transition-colors duration-200"
              >
                Office Food
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
