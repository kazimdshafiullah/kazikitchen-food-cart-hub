
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
      return;
    }

    // Check if cart contains frozen food items
    const hasFrozenFood = cart.some(item => Boolean(item.product.is_frozen_food));
    
    if (hasFrozenFood) {
      navigate('/frozen-food-checkout');
    } else {
      navigate('/weekend-menu-checkout');
    }
  }, [cart, navigate]);

  // Show loading while redirecting
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
};

export default Checkout;
