
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  products, 
  categories, 
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
  getPopularProducts
} from "@/data/products";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  
  const [displayProducts, setDisplayProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [title, setTitle] = useState<string>("All Products");
  
  useEffect(() => {
    if (searchQuery) {
      setDisplayProducts(searchProducts(searchQuery));
      setTitle(`Search Results for "${searchQuery}"`);
      setActiveCategory(null);
    } else if (categoryParam) {
      const categoryProducts = getProductsByCategory(categoryParam);
      setDisplayProducts(categoryProducts);
      const category = categories.find(c => c.id === categoryParam);
      setTitle(category ? category.name : "Products");
      setActiveCategory(categoryParam);
    } else {
      setDisplayProducts(products);
      setTitle("All Products");
      setActiveCategory(null);
    }
  }, [categoryParam, searchQuery]);
  
  const featuredProducts = getFeaturedProducts();
  const popularProducts = getPopularProducts();
  
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Section */}
      <section id="categories" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Food Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                id={category.id}
                name={category.name}
                image={category.image}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Products */}
      <section id="popular" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* All Products / Category Products / Search Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          
          {/* Category filter buttons */}
          {!searchQuery && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => {
                  setDisplayProducts(products);
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
                  onClick={() => {
                    const categoryProducts = getProductsByCategory(category.id);
                    setDisplayProducts(categoryProducts);
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
          
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
