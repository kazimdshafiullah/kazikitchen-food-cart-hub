
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Users, Crown } from "lucide-react";

const WeekendOrder = () => {
  const { type, day, category } = useParams();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Mock data - this would come from your database
  const getItemDetails = () => {
    if (type === "school") {
      return {
        name: "Egg Roll",
        price: 45,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        description: "Delicious egg roll with fresh vegetables and special sauce"
      };
    } else {
      const prices = {
        regular: 140,
        diet: 160,
        premium: 220
      };
      return {
        name: `${category?.charAt(0).toUpperCase()}${category?.slice(1)} Chicken Curry Rice`,
        price: prices[category as keyof typeof prices] || 140,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: `${category?.charAt(0).toUpperCase()}${category?.slice(1)} chicken curry with premium basmati rice`
      };
    }
  };

  const itemDetails = getItemDetails();

  const getOrderOptions = () => {
    const basePrice = itemDetails.price;
    
    if (type === "school") {
      return [
        {
          id: "single",
          title: "Single Order",
          price: basePrice,
          originalPrice: null,
          description: "Perfect for one student",
          icon: <Users className="w-5 h-5" />,
          persons: 1
        }
      ];
    } else {
      return [
        {
          id: "single",
          title: "Single Order",
          price: basePrice,
          originalPrice: null,
          description: "Perfect for one person",
          icon: <Users className="w-5 h-5" />,
          persons: 1
        },
        {
          id: "combo-2",
          title: "2 Persons Combo",
          price: Math.floor(basePrice * 1.85), // Slight discount
          originalPrice: basePrice * 2,
          description: "Great value for two colleagues",
          icon: <Users className="w-5 h-5" />,
          persons: 2,
          savings: (basePrice * 2) - Math.floor(basePrice * 1.85)
        },
        {
          id: "combo-4",
          title: "4 Persons Combo",
          price: Math.floor(basePrice * 3.57), // Better discount
          originalPrice: basePrice * 4,
          description: "Perfect for team lunch",
          icon: <Users className="w-5 h-5" />,
          persons: 4,
          savings: (basePrice * 4) - Math.floor(basePrice * 3.57)
        }
      ];
    }
  };

  const orderOptions = getOrderOptions();

  const handleAddToCart = () => {
    if (!selectedOption) return;
    
    const option = orderOptions.find(opt => opt.id === selectedOption);
    if (option) {
      // Add to cart logic here
      console.log("Adding to cart:", option);
      // Navigate to cart or show success message
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-amber-600">
            <Link to="/" className="hover:text-amber-800">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/weekend-menu" className="hover:text-amber-800">Weekend Menu</Link>
            <span className="mx-2">/</span>
            <span className="text-amber-800 font-medium">
              {type === "school" ? "School Tiffin" : "Office Food"} - {day?.charAt(0).toUpperCase()}{day?.slice(1)}
            </span>
          </nav>
        </div>

        {/* Item Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative">
            <img
              src={itemDetails.image}
              alt={itemDetails.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <Badge className="absolute top-4 left-4 bg-amber-500 text-white text-lg px-3 py-1">
              {day?.charAt(0).toUpperCase()}{day?.slice(1)}
            </Badge>
            {category && category !== "school" && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg px-3 py-1">
                <Crown className="w-4 h-4 mr-1" />
                {category.charAt(0).toUpperCase()}{category.slice(1)}
              </Badge>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-amber-800 mb-4">{itemDetails.name}</h1>
            <p className="text-lg text-amber-700 mb-6">{itemDetails.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-amber-600">
                <span className="font-medium">Day:</span>
                <span className="ml-2">{day?.charAt(0).toUpperCase()}{day?.slice(1)}</span>
              </div>
              <div className="flex items-center text-amber-600">
                <span className="font-medium">Category:</span>
                <span className="ml-2">
                  {type === "school" ? "School Tiffin" : `Office Food - ${category?.charAt(0).toUpperCase()}${category?.slice(1)}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center">Choose Your Order Option</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {orderOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedOption === option.id
                    ? "border-amber-500 shadow-lg bg-amber-50"
                    : "border-amber-200 hover:border-amber-400 hover:shadow-md"
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="flex items-center justify-center mb-2">
                    {option.icon}
                    <span className="ml-2 font-semibold text-lg">{option.persons} Person{option.persons > 1 ? 's' : ''}</span>
                  </div>
                  <CardTitle className="text-xl text-amber-800">{option.title}</CardTitle>
                  {option.savings && (
                    <Badge className="bg-red-500 text-white mx-auto">
                      Save ৳{option.savings}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-amber-800">৳{option.price}</span>
                      {option.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">৳{option.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-amber-600 text-sm">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add to Cart Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
              disabled={!selectedOption}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>

          {!selectedOption && (
            <p className="text-center text-amber-600 mt-4">Please select an option to continue</p>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50">
            <Link to="/weekend-menu">← Back to Weekend Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeekendOrder;
