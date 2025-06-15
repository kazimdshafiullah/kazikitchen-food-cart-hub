
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import TopBanner from "@/components/TopBanner";
import WeekendMenuSection from "@/components/WeekendMenuSection";
import WeeklyMenuSection from "@/components/WeeklyMenuSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Utensils, ShoppingBag, Clock, Settings } from "lucide-react";

const Index = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const featuredProducts = products.filter(product => product.featured);
  const popularProducts = products.filter(product => product.popular);

  return (
    <div className="min-h-screen">
      <TopBanner />
      
      {/* Admin Quick Access */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-end">
            <Link to="/admin/menu-management">
              <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-900 hover:bg-amber-100">
                <Settings className="w-4 h-4 mr-2" />
                Admin Menu Management
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Hero />
      
      {/* Quick Action Cards */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-amber-800">
            What would you like to order today?
          </h2>
          <p className="text-center text-amber-600 mb-12 max-w-2xl mx-auto">
            Choose from our carefully curated menu options designed to satisfy your taste buds and fit your lifestyle.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Frozen Food Card */}
            <Link to="/frozen-food" className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Frozen Food</h3>
                <p className="text-gray-600 text-sm">
                  Premium frozen meals ready to heat and enjoy
                </p>
              </div>
            </Link>

            {/* Weekend Menu Card */}
            <Link to="/weekend-menu" className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Weekend Menu</h3>
                <p className="text-gray-600 text-sm">
                  Fresh daily meals for offices and school tiffin
                </p>
              </div>
            </Link>

            {/* Weekly Orders Card */}
            <Link to="/weekly-orders" className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Orders</h3>
                <p className="text-gray-600 text-sm">
                  Plan your week with our subscription meals
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Weekend Menu Section */}
      <WeekendMenuSection />
      
      {/* Weekly Menu Section */}
      <WeeklyMenuSection />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Browse Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Featured Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-600 font-bold">৳{product.price}</span>
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
