
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useFeaturedProducts, usePopularProducts, useProductsByCategory } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import WeeklyMenuSection from "@/components/WeeklyMenuSection";
import TopBanner from "@/components/TopBanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [title, setTitle] = useState<string>("All Products");
  
  const { data: allProducts, isLoading: allProductsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: categoryProducts, isLoading: categoryProductsLoading } = useProductsByCategory(categoryParam || "");
  
  // Filter products based on search and category
  const getDisplayProducts = () => {
    if (searchQuery && allProducts) {
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return filtered;
    }
    
    if (categoryParam && categoryProducts) {
      return categoryProducts;
    }
    
    return allProducts || [];
  };

  const displayProducts = getDisplayProducts();
  const isDisplayLoading = searchQuery ? allProductsLoading : (categoryParam ? categoryProductsLoading : allProductsLoading);
  
  useEffect(() => {
    if (searchQuery) {
      setTitle(`Search Results for "${searchQuery}"`);
      setActiveCategory(null);
    } else if (categoryParam && categories) {
      const category = categories.find(c => c.id === categoryParam);
      setTitle(category ? category.name : "Products");
      setActiveCategory(categoryParam);
    } else {
      setTitle("All Products");
      setActiveCategory(null);
    }
  }, [categoryParam, searchQuery, categories]);
  
  return (
    <div>
      {/* Top Banner with Categories and Popular Items */}
      <TopBanner />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Weekly Food Service Section */}
      <WeeklyMenuSection />
      
      {/* All Products / Category Products / Search Results */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          
          {/* Category filter buttons */}
          {!searchQuery && categories && (
            <div className="mb-6 md:mb-8 flex flex-wrap gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTitle("All Products");
                  setActiveCategory(null);
                  window.history.pushState({}, "", "/");
                }}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTitle(category.name);
                    setActiveCategory(category.id);
                    window.history.pushState({}, "", `/?category=${category.id}`);
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
          
          {isDisplayLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">No products found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
