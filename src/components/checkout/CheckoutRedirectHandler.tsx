
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
    const hasFrozenFood = cart.some(item => {
      console.log('Checking item:', item.product.name, 'is_frozen_food:', item.product.is_frozen_food);
      return item.product.is_frozen_food === true;
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
