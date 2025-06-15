
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { toast } from "@/components/ui/sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  console.log("ProductCard - Product:", product);
  console.log("ProductCard - Link will go to:", `/product/${product.id}`);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Convert the database product to cart format
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || "/placeholder.svg",
      category: "food", // Default category for cart
      description: product.description || "",
      is_frozen_food: product.is_frozen_food || false
    };
    addToCart(cartProduct, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  // Convert USD to BDT for display
  const bdtPrice = Number(product.price) * 110;

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden block"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="text-base md:text-lg font-semibold">{product.name}</h3>
        <p className="text-xs md:text-sm text-gray-500 mt-1 mb-2 flex-1">
          {product.description ? (
            product.description.length > 60 
              ? `${product.description.substring(0, 60)}...` 
              : product.description
          ) : "Delicious food item"}
        </p>
        {product.is_frozen_food && (
          <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mb-2 self-start">
            Frozen Food
          </span>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-base md:text-lg font-bold text-kazi-red">
            ৳{bdtPrice.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="bg-kazi-green hover:bg-kazi-light-green text-white text-xs md:text-sm"
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
