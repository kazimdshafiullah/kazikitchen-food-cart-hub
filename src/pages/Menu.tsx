
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useFeaturedProducts, usePopularProducts, useProductsByCategory } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Menu = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Our Complete Menu</h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Discover our full range of delicious dishes, fresh ingredients, and special offers
          </p>
        </div>

        {/* Categories */}
        {!searchQuery && categories && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.image_url || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <section className="py-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-amber-800">{title}</h2>
          
          {/* Category filter buttons */}
          {!searchQuery && categories && (
            <div className="mb-6 md:mb-8 flex flex-wrap gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTitle("All Products");
                  setActiveCategory(null);
                  window.history.pushState({}, "", "/menu");
                }}
                className={activeCategory === null ? "bg-amber-500 text-white" : "border-amber-400 text-amber-700 hover:bg-amber-50"}
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
                    window.history.pushState({}, "", `/menu?category=${category.id}`);
                  }}
                  className={activeCategory === category.id ? "bg-amber-500 text-white" : "border-amber-400 text-amber-700 hover:bg-amber-50"}
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
              <p className="text-lg text-amber-600">No products found.</p>
            </div>
          )}
        </section>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
