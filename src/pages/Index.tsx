
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useMainCategories, useSubCategories, useMealTypes } from "@/hooks/useWeeklyMenu";
import { Utensils, ShoppingBag, Clock, Users, Crown, Heart, Snowflake, ChefHat, Star } from "lucide-react";

const Index = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: mainCategories = [] } = useMainCategories();
  const { data: mealTypes = [] } = useMealTypes();

  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  const frozenProducts = products.filter(product => product.is_frozen_food).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Delicious Food, <span className="text-orange-200">Delivered Fresh</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Fresh frozen foods, daily tiffin service, and office catering - all made with love
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                <Link to="/frozen-food">
                  <Snowflake className="mr-2 h-5 w-5" />
                  Explore Frozen Food
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <Link to="/weekend-menu">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Weekend Menu
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Choose from our carefully curated food options</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Frozen Food Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Snowflake className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Frozen Food</CardTitle>
                <CardDescription>Premium frozen meals ready to heat and enjoy</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Ready-to-cook frozen items with fresh ingredients</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/frozen-food">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Shop Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Weekend Menu Cards */}
            {mainCategories.map((category) => (
              <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-orange-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    {category.name === 'School Tiffin' ? (
                      <Users className="w-8 h-8 text-orange-600" />
                    ) : (
                      <Utensils className="w-8 h-8 text-orange-600" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Order by {category.order_cutoff_time.slice(0, 5)}
                    </span>
                  </div>
                  <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                    <Link to="/weekend-menu">
                      <ChefHat className="mr-2 h-4 w-4" />
                      Order Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meal Plans Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Meal Plans</h2>
            <p className="text-lg text-gray-600">Different options to suit your lifestyle and preferences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {mealTypes.map((mealType) => {
              const getIcon = () => {
                switch (mealType.name) {
                  case 'Regular': return <Utensils className="w-6 h-6" />;
                  case 'Diet': return <Heart className="w-6 h-6" />;
                  case 'Premium': return <Crown className="w-6 h-6" />;
                  default: return <Utensils className="w-6 h-6" />;
                }
              };

              const getColor = () => {
                switch (mealType.name) {
                  case 'Regular': return 'border-blue-200 hover:border-blue-400';
                  case 'Diet': return 'border-green-200 hover:border-green-400';
                  case 'Premium': return 'border-purple-200 hover:border-purple-400';
                  default: return 'border-gray-200 hover:border-gray-400';
                }
              };

              const getBgColor = () => {
                switch (mealType.name) {
                  case 'Regular': return 'bg-blue-50';
                  case 'Diet': return 'bg-green-50';
                  case 'Premium': return 'bg-purple-50';
                  default: return 'bg-gray-50';
                }
              };

              const getIconColor = () => {
                switch (mealType.name) {
                  case 'Regular': return 'text-blue-600';
                  case 'Diet': return 'text-green-600';
                  case 'Premium': return 'text-purple-600';
                  default: return 'text-gray-600';
                }
              };

              return (
                <Card key={mealType.id} className={`border-2 transition-all duration-300 hover:shadow-lg ${getColor()}`}>
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getBgColor()}`}>
                      <div className={getIconColor()}>
                        {getIcon()}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{mealType.name} Plan</CardTitle>
                    <CardDescription>{mealType.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
              <p className="text-lg text-gray-600">Try our most popular dishes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600 font-bold text-lg">৳{Number(product.price) * 110}</span>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-orange-200">Menu Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-orange-200">Frozen Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-orange-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">3</div>
              <div className="text-orange-200">Meal Plans</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Order?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the convenience of fresh, homemade food delivered to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link to="/frozen-food">Start Shopping</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              <Link to="/weekend-menu">Plan Your Week</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
