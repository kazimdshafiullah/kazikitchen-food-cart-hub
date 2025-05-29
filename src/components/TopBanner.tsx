
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useFeaturedProducts, usePopularProducts } from "@/hooks/useProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TopBanner = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: popularProducts, isLoading: popularLoading } = usePopularProducts();

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    window.history.pushState({}, "", `/?category=${categoryId}`);
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-r from-kazi-orange to-kazi-red text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-2">
                Food Categories
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50 min-w-[200px]">
              {categoriesLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : (
                categories?.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id, category.name)}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Featured Items Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-2">
                Featured Items
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50 min-w-[250px]">
              {featuredLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : (
                featuredProducts?.slice(0, 5).map((product) => (
                  <DropdownMenuItem key={product.id} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <Badge variant="secondary">৳{Number(product.price).toFixed(2)}</Badge>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Popular Items Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-2">
                Popular Items
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50 min-w-[250px]">
              {popularLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : (
                popularProducts?.slice(0, 5).map((product) => (
                  <DropdownMenuItem key={product.id} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <Badge variant="secondary">৳{Number(product.price).toFixed(2)}</Badge>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Access Links */}
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={() => document.getElementById('weekend-order-menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Weekend Order Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
