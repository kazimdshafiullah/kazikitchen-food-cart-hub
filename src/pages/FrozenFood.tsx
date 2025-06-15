
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star } from "lucide-react";

// Mock data for frozen food items
const frozenFoodItems = [
  {
    id: "1",
    name: "Alu Shingara",
    price: 45,
    image: "https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400",
    description: "Crispy potato-filled triangular pastry",
    rating: 4.5
  },
  {
    id: "2",
    name: "Veg Samosa",
    price: 40,
    image: "https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400",
    description: "Traditional vegetable samosa with spices",
    rating: 4.3
  },
  {
    id: "3",
    name: "Chicken Roll",
    price: 85,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Delicious chicken wrapped in soft paratha",
    rating: 4.7
  },
  {
    id: "4",
    name: "Half Moon",
    price: 35,
    image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400",
    description: "Sweet half-moon shaped traditional dessert",
    rating: 4.2
  }
];

const comboItems = [
  {
    id: "combo-1",
    name: "Combo-1",
    price: 180,
    originalPrice: 200,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "2 Alu Shingara + 2 Veg Samosa + 1 Chicken Roll",
    items: ["2x Alu Shingara", "2x Veg Samosa", "1x Chicken Roll"],
    rating: 4.6
  },
  {
    id: "combo-2", 
    name: "Combo-2",
    price: 250,
    originalPrice: 280,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Family combo with variety of items",
    items: ["3x Chicken Roll", "4x Alu Shingara", "2x Half Moon"],
    rating: 4.8
  },
  {
    id: "combo-3",
    name: "Combo-3",
    price: 320,
    originalPrice: 360,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Premium combo for large families",
    items: ["4x Chicken Roll", "6x Alu Shingara", "4x Veg Samosa", "3x Half Moon"],
    rating: 4.9
  },
  {
    id: "children-combo",
    name: "Children Chicken Combo",
    price: 120,
    originalPrice: 140,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Kid-friendly combo with chicken items",
    items: ["2x Mini Chicken Roll", "2x Alu Shingara", "1x Half Moon"],
    rating: 4.4
  }
];

const FrozenFood = () => {
  const [activeTab, setActiveTab] = useState("all-items");

  const ItemCard = ({ item, isCombo = false }: { item: any, isCombo?: boolean }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-orange-200 hover:border-orange-400">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isCombo && item.originalPrice && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              Save ৳{item.originalPrice - item.price}
            </Badge>
          )}
          <div className="absolute bottom-2 left-2 flex items-center bg-white/90 rounded px-2 py-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg text-orange-800 mb-2">{item.name}</CardTitle>
        <p className="text-orange-600 text-sm mb-3">{item.description}</p>
        
        {isCombo && item.items && (
          <div className="mb-3">
            <p className="text-xs font-medium text-orange-700 mb-1">Includes:</p>
            <ul className="text-xs text-orange-600">
              {item.items.map((subItem: string, index: number) => (
                <li key={index}>• {subItem}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-800">৳{item.price}</span>
            {isCombo && item.originalPrice && (
              <span className="text-sm text-gray-400 line-through">৳{item.originalPrice}</span>
            )}
          </div>
          <Button 
            asChild
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Link to={`/product/${item.id}`}>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Order
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Frozen Food Collection</h1>
          <p className="text-xl text-orange-700 max-w-2xl mx-auto">
            Ready-to-cook frozen delights prepared with authentic flavors and premium ingredients
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="all-items" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              All Items
            </TabsTrigger>
            <TabsTrigger value="combo" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Combo Offers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-items">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {frozenFoodItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combo">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {comboItems.map((item) => (
                <ItemCard key={item.id} item={item} isCombo={true} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-orange-400 text-orange-700 hover:bg-orange-50">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FrozenFood;
