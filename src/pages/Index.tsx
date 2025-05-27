
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useFeaturedProducts, usePopularProducts, useProductsByCategory } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
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
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: popularProducts, isLoading: popularLoading } = usePopularProducts();
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
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Section */}
      <section id="categories" className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Food Categories</h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories?.map((category) => (
                <CategoryCard 
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.image_url || "/placeholder.svg"}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Featured Items</h2>
          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Popular Products */}
      <section id="popular" className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Popular Items</h2>
          {popularLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {popularProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
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
