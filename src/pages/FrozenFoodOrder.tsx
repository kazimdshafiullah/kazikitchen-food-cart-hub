
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/sonner";

const FrozenFoodOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Mock data - this would come from your database
  const getItemDetails = () => {
    const items: { [key: string]: any } = {
      "1": {
        id: "1",
        name: "Alu Shingara",
        price: 45,
        image: "https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400",
        description: "Crispy potato-filled triangular pastry made with authentic spices and fresh potatoes. Perfect for snacking or as a side dish.",
        rating: 4.5,
        category: "Individual Item",
        prepTime: "15-20 minutes",
        servingSize: "1 piece"
      },
      "2": {
        id: "2",
        name: "Veg Samosa",
        price: 40,
        image: "https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400",
        description: "Traditional vegetable samosa filled with spiced vegetables and herbs, wrapped in crispy pastry.",
        rating: 4.3,
        category: "Individual Item",
        prepTime: "12-15 minutes",
        servingSize: "1 piece"
      },
      "3": {
        id: "3",
        name: "Chicken Roll",
        price: 85,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        description: "Delicious chicken wrapped in soft paratha with fresh vegetables and special sauce.",
        rating: 4.7,
        category: "Individual Item", 
        prepTime: "20-25 minutes",
        servingSize: "1 roll"
      },
      "combo-1": {
        id: "combo-1",
        name: "Combo-1",
        price: 180,
        originalPrice: 200,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        description: "Perfect family combo with variety of our most popular items. Great value for money!",
        rating: 4.6,
        category: "Combo Offer",
        prepTime: "25-30 minutes",
        servingSize: "2-3 people",
        items: ["2x Alu Shingara", "2x Veg Samosa", "1x Chicken Roll"],
        savings: 20
      }
    };
    return items[id || "1"] || items["1"];
  };

  const itemDetails = getItemDetails();

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const getTotalPrice = () => {
    return itemDetails.price * quantity;
  };

  const handleAddToCart = () => {
    // Convert the item to cart product format
    const cartProduct = {
      id: itemDetails.id,
      name: itemDetails.name,
      price: itemDetails.price,
      image: itemDetails.image,
      category: itemDetails.category,
      description: itemDetails.description
    };

    addToCart(cartProduct, quantity);
    toast.success(`Added ${quantity}x ${itemDetails.name} to cart!`);
    
    // Navigate to cart after adding
    setTimeout(() => {
      navigate("/cart");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-amber-600">
            <Link to="/" className="hover:text-amber-800">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/frozen-food" className="hover:text-amber-800">Frozen Food</Link>
            <span className="mx-2">/</span>
            <span className="text-amber-800 font-medium">{itemDetails.name}</span>
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
            {itemDetails.savings && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg px-3 py-1">
                Save ৳{itemDetails.savings}
              </Badge>
            )}
            <div className="absolute bottom-4 left-4 flex items-center bg-white/90 rounded px-3 py-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
              <span className="font-semibold text-lg">{itemDetails.rating}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <Badge className="w-fit mb-4 bg-amber-100 text-amber-800 px-3 py-1">
              {itemDetails.category}
            </Badge>
            
            <h1 className="text-3xl font-bold text-amber-800 mb-4">{itemDetails.name}</h1>
            <p className="text-lg text-amber-700 mb-6">{itemDetails.description}</p>
            
            {itemDetails.items && (
              <div className="mb-6">
                <h3 className="font-semibold text-amber-800 mb-2">Includes:</h3>
                <ul className="space-y-1">
                  {itemDetails.items.map((item: string, index: number) => (
                    <li key={index} className="text-amber-600 flex items-center">
                      <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-amber-600">
                <span className="font-medium w-32">Prep Time:</span>
                <span>{itemDetails.prepTime}</span>
              </div>
              <div className="flex items-center text-amber-600">
                <span className="font-medium w-32">Serving Size:</span>
                <span>{itemDetails.servingSize}</span>
              </div>
              <div className="flex items-center text-amber-600">
                <span className="font-medium w-32">Rating:</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span>{itemDetails.rating} / 5</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-amber-800">৳{itemDetails.price}</span>
              {itemDetails.originalPrice && (
                <span className="text-xl text-gray-400 line-through">৳{itemDetails.originalPrice}</span>
              )}
              <span className="text-sm text-amber-600">per {itemDetails.category.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Quantity Selection */}
        <Card className="max-w-md mx-auto mb-8 border-2 border-amber-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-amber-800">Select Quantity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quantity Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="border-amber-400 text-amber-700 hover:bg-amber-50"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg px-6 py-2 min-w-[80px] text-center">
                <span className="text-2xl font-bold text-amber-800">{quantity}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                className="border-amber-400 text-amber-700 hover:bg-amber-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Total Price */}
            <div className="text-center space-y-2">
              <p className="text-amber-600">Total Price:</p>
              <p className="text-3xl font-bold text-amber-800">৳{getTotalPrice()}</p>
              {quantity > 1 && (
                <p className="text-sm text-amber-600">
                  ৳{itemDetails.price} × {quantity} = ৳{getTotalPrice()}
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 text-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button asChild variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50">
            <Link to="/frozen-food">← Back to Frozen Food</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FrozenFoodOrder;
