
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useComboOffers } from "@/hooks/useComboOffers";

const FrozenFood = () => {
  const [activeTab, setActiveTab] = useState("all-items");
  const { data: products = [] } = useProducts();
  const { data: comboOffers = [] } = useComboOffers();

  const frozenFoodItems = products.filter(product => product.is_frozen_food);

  const ItemCard = ({ item, isCombo = false }: { item: any, isCombo?: boolean }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-orange-200 hover:border-orange-400">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={item.image_url || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isCombo && item.original_price && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              Save ৳{item.original_price - item.combo_price}
            </Badge>
          )}
          <div className="absolute bottom-2 left-2 flex items-center bg-white/90 rounded px-2 py-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg text-orange-800 mb-2">{item.name}</CardTitle>
        <p className="text-orange-600 text-sm mb-3">{item.description || "Delicious frozen food item"}</p>
        
        {isCombo && item.combo_offer_items && (
          <div className="mb-3">
            <p className="text-xs font-medium text-orange-700 mb-1">Includes:</p>
            <ul className="text-xs text-orange-600">
              {item.combo_offer_items.map((subItem: any, index: number) => (
                <li key={index}>• {subItem.quantity}x {subItem.products.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-800">
              ৳{isCombo ? item.combo_price : Number(item.price) * 110}
            </span>
            {isCombo && item.original_price && (
              <span className="text-sm text-gray-400 line-through">৳{item.original_price}</span>
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
              {comboOffers.map((item) => (
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
