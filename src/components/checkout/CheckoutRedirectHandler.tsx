
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
    const hasFrozenFood = cart.some(item => Boolean(item.product.is_frozen_food));
    
    if (hasFrozenFood) {
      navigate('/frozen-food-checkout');
    } else {
      navigate('/weekend-menu-checkout');
    }
  }, [cart, navigate]);

  return <CheckoutLoading />;
};

export default CheckoutRedirectHandler;
