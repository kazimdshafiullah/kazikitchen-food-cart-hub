
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useMainCategories, useSubCategories, useMealTypes } from "@/hooks/useWeeklyMenu";
import { useMenuItems } from "@/hooks/useMenuManagement";
import { Utensils, ShoppingBag, Clock, Users, Crown, Heart, Snowflake, ChefHat, Star } from "lucide-react";
import { useMemo } from "react";

const Index = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: mainCategories = [] } = useMainCategories();
  const { data: mealTypes = [] } = useMealTypes();
  const { data: menuItems = [] } = useMenuItems();

  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  const frozenProducts = products.filter(product => product.is_frozen_food).slice(0, 3);
  
  // Get frozen food items from the new menu system
  const frozenFoodCategory = mainCategories.find(cat => cat.name === 'frozen_food');
  const frozenMenuItems = useMemo(() => {
    if (!frozenFoodCategory) return [];
    return menuItems.filter(item => 
      item.main_category_id === frozenFoodCategory.id && item.is_active
    ).slice(0, 3);
  }, [menuItems, frozenFoodCategory]);

  // Get weekend menu items (Office Food and School Tiffin)
  const weekendMenuItems = useMemo(() => {
    const officeFoodCategory = mainCategories.find(cat => cat.name === 'Office Food');
    const schoolTiffinCategory = mainCategories.find(cat => cat.name === 'School Tiffin');
    
    const items = menuItems.filter(item => {
      if (!item.is_active) return false;
      
      return (officeFoodCategory && item.main_category_id === officeFoodCategory.id) ||
             (schoolTiffinCategory && item.main_category_id === schoolTiffinCategory.id);
    }).slice(0, 3);
    
    return items;
  }, [menuItems, mainCategories]);

  // Combine all featured items from different sources
  const allFeaturedItems = useMemo(() => {
    const items = [
      // Featured products from old system
      ...featuredProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price) * 110, // Convert to BDT
        image_url: product.image_url,
        type: 'product'
      })),
      // Frozen menu items from new system
      ...frozenMenuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price), // Already in BDT
        image_url: item.image_url,
        type: 'frozen_menu_item'
      })),
      // Weekend menu items from new system
      ...weekendMenuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price), // Already in BDT
        image_url: item.image_url,
        type: 'weekend_menu_item'
      }))
    ];
    
    return items.slice(0, 4); // Show max 4 items
  }, [featuredProducts, frozenMenuItems, weekendMenuItems]);

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
              <Button asChild size="lg" className="bg-orange-800 text-white hover:bg-orange-900 border-2 border-orange-800">
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
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-orange-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <Snowflake className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Frozen Food</CardTitle>
                  <CardDescription>Premium frozen meals ready to heat and enjoy</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Ready-to-cook frozen items with fresh ingredients</p>
                  <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                    <Link to="/frozen-food">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Shop Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-amber-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                    <ChefHat className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">Weekend Menu</CardTitle>
                  <CardDescription>School Tiffin & Office Food daily delivery</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Order by 10:00 PM</span>
                  </div>
                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                    <Link to="/weekend-menu">
                      <Utensils className="mr-2 h-4 w-4" />
                      Order Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {allFeaturedItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
              <p className="text-lg text-gray-600">Try our most popular dishes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allFeaturedItems.map((item) => (
                <Card key={`${item.type}-${item.id}`} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600 font-bold text-lg">৳{item.price.toFixed(2)}</span>
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
              <div className="text-3xl font-bold mb-2">{(products.length + menuItems.length)}+</div>
              <div className="text-orange-200">Menu Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{frozenMenuItems.length + frozenProducts.length}+</div>
              <div className="text-orange-200">Frozen Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-orange-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{mealTypes.length}</div>
              <div className="text-orange-200">Meal Plans</div>
            </div>
          </div>
        </div>
      </section>

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
