
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CheckoutLoading from "./CheckoutLoading";

const CheckoutRedirectHandler = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
      return;
    }

    // Check if cart contains frozen food items
    // In the new system, frozen food items won't have is_frozen_food flag
    // Instead, we need to check if the items belong to the frozen_food main category
    const hasFrozenFood = cart.some(item => {
      console.log('Checking item:', item.product.name, 'category:', item.product.category);
      // For now, check the category field until we integrate with the new database
      return item.product.category === 'frozen-food' || item.product.is_frozen_food === true;
    });
    
    console.log('Cart contents:', cart);
    console.log('Has frozen food:', hasFrozenFood);
    
    if (hasFrozenFood) {
      console.log('Redirecting to frozen food checkout');
      navigate('/frozen-food-checkout');
    } else {
      console.log('Redirecting to weekend menu checkout');
      navigate('/weekend-menu-checkout');
    }
  }, [cart, navigate]);

  return <CheckoutLoading />;
};

export default CheckoutRedirectHandler;
