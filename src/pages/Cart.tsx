
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, Trash, ShoppingCart } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  
  // Convert USD to BDT (approximate rate: 1 USD = 110 BDT)
  const bdtSubtotal = subtotal * 110;
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild>
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b">
              <div className="col-span-6 font-semibold">Product</div>
              <div className="col-span-2 font-semibold text-center">Price</div>
              <div className="col-span-2 font-semibold text-center">Quantity</div>
              <div className="col-span-2 font-semibold text-right">Total</div>
            </div>
            
            {cart.map(item => (
              <div key={item.product.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border-b items-center">
                {/* Product */}
                <div className="sm:col-span-6 flex items-center">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-4">
                    <img 
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Link to={`/product/${item.product.id}`} className="font-medium hover:text-kazi-orange">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 sm:hidden">
                      ৳{(item.product.price * 110).toFixed(2)}
                    </p>
                    {item.product.is_frozen_food && (
                      <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1">
                        Frozen Food
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Price */}
                <div className="hidden sm:block sm:col-span-2 text-center">
                  ৳{(item.product.price * 110).toFixed(2)}
                </div>
                
                {/* Quantity */}
                <div className="sm:col-span-2 flex justify-between sm:justify-center items-center">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="sm:hidden text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Total */}
                <div className="sm:col-span-2 flex justify-between items-center">
                  <span className="sm:hidden">Total:</span>
                  <span className="font-medium sm:ml-auto">
                    ৳{(item.product.price * item.quantity * 110).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="hidden sm:block text-red-500 hover:text-red-700 ml-3"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="p-4 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Button 
                asChild 
                variant="ghost" 
                size="sm"
              >
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">৳{bdtSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-kazi-red">৳{bdtSubtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              asChild 
              className="w-full bg-kazi-orange hover:bg-opacity-90"
            >
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
