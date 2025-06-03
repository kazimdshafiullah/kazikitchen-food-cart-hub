
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, ChefHat, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/9a12eda0-fd9e-4b5c-8771-a9c1d6b6851a.png" 
              alt="Kazi Kitchen Logo" 
              className="mx-auto h-32 w-32 mb-6"
            />
          </div>
          <h1 className="text-5xl font-bold text-amber-800 mb-4">
            Your Food Solution
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-2xl mx-auto">
            "IN ONE PLACE" - From frozen delights to weekly meal plans, we've got everything you need for delicious, convenient dining.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Fast Delivery
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Family Combos
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Premium Quality
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 px-4 py-2">
              <ChefHat className="w-4 h-4 mr-2" />
              Fresh Daily
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Navigation Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-amber-800 mb-12">Choose Your Dining Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Home/Regular Menu */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-400">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-amber-800">Home</CardTitle>
                <CardDescription className="text-amber-600">
                  Explore our complete menu of fresh, delicious meals
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-amber-700 mb-6">Browse all our available dishes, combos, and daily specials</p>
                <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Link to="/menu">View All Menu</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Frozen Food */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-400">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
                <CardTitle className="text-2xl text-amber-800">Frozen Food</CardTitle>
                <CardDescription className="text-amber-600">
                  Ready-to-cook frozen delights and combo offers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-amber-700 mb-6">Convenient frozen meals perfect for quick preparation</p>
                <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Link to="/frozen-food">Order Frozen Food</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Weekend Order Menu */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-400">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-amber-800">Weekend Order Menu</CardTitle>
                <CardDescription className="text-amber-600">
                  School Tiffin & Office Food weekly plans
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-amber-700 mb-6">Weekly meal subscriptions for schools and offices</p>
                <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Link to="/weekend-menu">Plan Your Week</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-12">Why Choose Kazi Kitchen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Fast Delivery</h3>
              <p className="text-amber-600">Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Quality Food</h3>
              <p className="text-amber-600">Fresh ingredients and authentic flavors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Family Combos</h3>
              <p className="text-amber-600">Special deals for families and groups</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Expert Chefs</h3>
              <p className="text-amber-600">Prepared by experienced culinary experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-xl text-amber-100 mb-8">Start your culinary journey with Kazi Kitchen today!</p>
          <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
            <Link to="/menu">Explore Menu</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
