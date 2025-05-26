
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ShoppingCart, Plus, Minus, ChevronLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading: productLoading, error } = useProduct(id || "");
  const { data: categories } = useCategories();
  
  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-20 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-4">The product you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    // Convert database product to cart format
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || "/placeholder.svg",
      category: "food",
      description: product.description || ""
    };
    addToCart(cartProduct, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };
  
  const categoryName = categories?.find(c => c.id === product.category_id)?.name || "Food";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden bg-white shadow-md">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-auto object-cover aspect-square"
          />
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-kazi-red mb-4">৳{Number(product.price).toFixed(2)}</p>
          
          <p className="text-gray-600 mb-6">{product.description || "Delicious food item from KaziKitchen"}</p>
          
          {/* Category */}
          <div className="mb-6">
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {categoryName}
            </span>
          </div>
          
          {/* Stock Status */}
          {product.in_stock && (
            <div className="mb-6">
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                In Stock
              </span>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-1 border-x">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4 mt-auto">
            <Button
              size="lg"
              className="flex-1 bg-kazi-green hover:bg-kazi-light-green"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              asChild
              size="lg"
              className="flex-1 bg-kazi-orange hover:bg-opacity-90"
              disabled={!product.in_stock}
            >
              <Link to="/cart">Buy Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
