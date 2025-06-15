
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  is_frozen_food?: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);
  
  useEffect(() => {
    // Calculate subtotal and item count whenever cart changes
    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    setSubtotal(total);
    setItemCount(count);
    
    console.log('Cart updated:', cart);
    console.log('Subtotal (USD):', total);
    console.log('Item count:', count);
  }, [cart]);
  
  const addToCart = (product: Product, quantity: number = 1) => {
    console.log('Adding to cart:', product, 'quantity:', quantity);
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        // If item already exists in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        toast.success(`Added ${quantity} more ${product.name} to cart`);
        return updatedCart;
      } else {
        // If item doesn't exist in cart, add new item
        toast.success(`Added ${product.name} to cart`);
        return [...prevCart, { product, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    console.log('Removing from cart:', productId);
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.product.id !== productId);
      toast.info("Item removed from cart");
      return updatedCart;
    });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    console.log('Updating quantity for:', productId, 'to:', quantity);
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      return updatedCart;
    });
  };
  
  const clearCart = () => {
    console.log('Clearing cart');
    setCart([]);
    toast.info("Cart cleared");
  };
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      subtotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
