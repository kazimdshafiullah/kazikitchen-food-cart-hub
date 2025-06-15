
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { ChevronLeft, FileText, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { Skeleton } from "@/components/ui/skeleton";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { settings: paymentSettings, loading: paymentLoading, error: paymentError } = usePaymentSettings();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bkash" | "ssl" | "">("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  
  // Convert USD to BDT (approximate rate: 1 USD = 110 BDT)
  const bdtSubtotal = subtotal * 110;
  
  // Available delivery locations
  const deliveryLocations = [
    'Dhanmondi',
    'Farmgate', 
    'Panthapath',
    'Karwanbazar',
    'New Market',
    'Banglamotor',
    'Shahbag',
    'Science Lab',
    'Elephant Road',
    'Mirpur Road',
    'Zigatola',
    'Lalmatia'
  ];
  
  // Available order IDs that exist in the mock data
  const availableOrderIds = [
    "ORD-1001", "ORD-1002", "ORD-1003", "ORD-1004", "ORD-1005",
    "ORD-1006", "ORD-1007", "ORD-1008", "ORD-1009", "ORD-1010"
  ];

  // Debug payment settings
  useEffect(() => {
    console.log('Payment settings debug:', {
      settings: paymentSettings,
      loading: paymentLoading,
      error: paymentError
    });
  }, [paymentSettings, paymentLoading, paymentError]);

  // Get available payment methods based on admin settings
  const getAvailablePaymentMethods = () => {
    if (!paymentSettings) {
      console.log('No payment settings available');
      return [];
    }
    
    const methods = [];
    if (paymentSettings.cod_enabled) methods.push("cash");
    if (paymentSettings.bkash_enabled) methods.push("bkash");
    if (paymentSettings.ssl_enabled) methods.push("ssl");
    
    console.log('Available payment methods:', methods);
    return methods;
  };

  const availablePaymentMethods = getAvailablePaymentMethods();

  // Auto-select first available payment method
  useEffect(() => {
    if (paymentMethod === "" && availablePaymentMethods.length > 0) {
      setPaymentMethod(availablePaymentMethods[0] as "cash" | "bkash" | "ssl");
    }
  }, [availablePaymentMethods, paymentMethod]);
  
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">You need to add items to your cart before checkout.</p>
          <Button asChild>
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto p-8">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">Order ID: {orderId}</p>
          <p className="text-gray-500 mb-8">Thank you for your order! This is a demo order.</p>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to={`/invoice/${orderId}`}>
                <FileText className="mr-2 h-4 w-4" />
                View Invoice
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!deliveryLocation) {
      toast.error("Please select a delivery location");
      return;
    }

    // Check COD order limits if applicable
    if (paymentMethod === "cash" && paymentSettings) {
      if (paymentSettings.cod_min_order > 0 && bdtSubtotal < paymentSettings.cod_min_order) {
        toast.error(`Minimum order value for Cash on Delivery is ৳${paymentSettings.cod_min_order}`);
        return;
      }
      if (paymentSettings.cod_max_order > 0 && bdtSubtotal > paymentSettings.cod_max_order) {
        toast.error(`Maximum order value for Cash on Delivery is ৳${paymentSettings.cod_max_order}`);
        return;
      }
    }
    
    // Use a random order ID from the available ones
    const randomIndex = Math.floor(Math.random() * availableOrderIds.length);
    const newOrderId = availableOrderIds[randomIndex];
    setOrderId(newOrderId);
    
    toast.success(`Order ${newOrderId} placed successfully! This is a demo order.`);
    clearCart();
    setOrderPlaced(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6"
        asChild
      >
        <Link to="/cart">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
      </Button>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" required />
                </div>
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deliveryLocation">Delivery Location</Label>
                  <Select value={deliveryLocation} onValueChange={setDeliveryLocation} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery area" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Division</Label>
                    <Input id="state" required />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input id="zipCode" required />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              {paymentLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : paymentError ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-2">Error loading payment settings</p>
                  <p className="text-sm text-gray-400">{paymentError}</p>
                </div>
              ) : availablePaymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No payment methods are currently available</p>
                  <p className="text-sm text-gray-400">Please contact support or try again later</p>
                </div>
              ) : (
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "cash" | "bkash" | "ssl")}
                >
                  {availablePaymentMethods.includes("cash") && (
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer">Cash on Delivery</Label>
                      {paymentSettings && (paymentSettings.cod_min_order > 0 || paymentSettings.cod_max_order > 0) && (
                        <span className="text-xs text-gray-500 ml-2">
                          {paymentSettings.cod_min_order > 0 && `Min: ৳${paymentSettings.cod_min_order}`}
                          {paymentSettings.cod_min_order > 0 && paymentSettings.cod_max_order > 0 && " | "}
                          {paymentSettings.cod_max_order > 0 && `Max: ৳${paymentSettings.cod_max_order}`}
                        </span>
                      )}
                    </div>
                  )}
                  {availablePaymentMethods.includes("bkash") && (
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="bkash" id="bkash" />
                      <Label htmlFor="bkash" className="cursor-pointer">bKash (Mobile Banking)</Label>
                    </div>
                  )}
                  {availablePaymentMethods.includes("ssl") && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ssl" id="ssl" />
                      <Label htmlFor="ssl" className="cursor-pointer">SSL Commerz (Credit/Debit Card)</Label>
                    </div>
                  )}
                </RadioGroup>
              )}
              
              {paymentMethod === "bkash" && availablePaymentMethods.includes("bkash") && (
                <div className="mt-4 p-4 bg-pink-50 rounded-md">
                  <p className="text-sm text-gray-500 mb-2">
                    You will be redirected to bKash to complete the payment.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="bkashNumber">bKash Account Number</Label>
                      <Input id="bkashNumber" placeholder="01XXXXXXXXX" />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === "ssl" && availablePaymentMethods.includes("ssl") && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-gray-500 mb-2">
                    You will be redirected to SSL Commerz to complete the payment.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full lg:w-auto bg-kazi-orange hover:bg-opacity-90"
              disabled={paymentLoading || availablePaymentMethods.length === 0}
            >
              {paymentLoading ? "Loading..." : "Place Order"}
            </Button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex py-2 border-b">
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm">
                        {item.product.name} <span className="text-gray-500">x{item.quantity}</span>
                      </h3>
                      <span className="text-sm font-medium">
                        ৳{(item.product.price * item.quantity * 110).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">৳{bdtSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">৳120.00</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-kazi-red">৳{(bdtSubtotal + 120).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              By placing your order, you agree to KaziKitchen's terms and conditions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
