
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { ChevronLeft, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { Skeleton } from "@/components/ui/skeleton";

const WeekendMenuCheckout = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { settings: paymentSettings, loading: paymentLoading, error: paymentError, refetch } = usePaymentSettings();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bkash" | "ssl" | "">("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  
  // Convert USD to BDT (approximate rate: 1 USD = 110 BDT)
  const bdtSubtotal = subtotal * 110;
  
  // Available delivery locations
  const deliveryLocations = [
    'Dhanmondi', 'Farmgate', 'Panthapath', 'Karwanbazar', 'New Market',
    'Banglamotor', 'Shahbag', 'Science Lab', 'Elephant Road', 'Mirpur Road',
    'Zigatola', 'Lalmatia'
  ];
  
  const availableOrderIds = [
    "ORD-1001", "ORD-1002", "ORD-1003", "ORD-1004", "ORD-1005",
    "ORD-1006", "ORD-1007", "ORD-1008", "ORD-1009", "ORD-1010"
  ];

  // Weekend menu always has free delivery
  const deliveryFee = 0;
  const totalAmount = bdtSubtotal + deliveryFee;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateOrderId = () => {
    return availableOrderIds[Math.floor(Math.random() * availableOrderIds.length)];
  };

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!deliveryLocation) {
      toast.error("Please select a delivery location");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "cash" && paymentSettings) {
      if (totalAmount < paymentSettings.cod_min_order) {
        toast.error(`Minimum order amount for Cash on Delivery is ৳${paymentSettings.cod_min_order}`);
        return;
      }
      if (totalAmount > paymentSettings.cod_max_order) {
        toast.error(`Maximum order amount for Cash on Delivery is ৳${paymentSettings.cod_max_order}`);
        return;
      }
    }

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setOrderPlaced(true);
    
    setTimeout(() => {
      clearCart();
      toast.success(`Order ${newOrderId} placed successfully!`);
    }, 1000);
  };

  if (paymentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (paymentError && !paymentSettings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Payment Settings Error</h2>
          <p className="text-gray-600">Unable to load payment settings. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-4">Add some weekend menu items to your cart!</p>
        <Button asChild>
          <Link to="/weekend-menu">Browse Weekend Menu</Link>
        </Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-green-50 p-8 rounded-lg">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-green-700 mb-4">Order ID: {orderId}</p>
          <p className="text-gray-600 mb-6">Thank you for your weekend menu order!</p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/weekend-menu">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to={`/order-status/${orderId}`}>
                <FileText className="w-4 h-4 mr-2" />
                Track Order
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Weekend Menu Checkout</h2>
          
          {/* Customer Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete address"
                />
              </div>
              <div>
                <Label htmlFor="location">Delivery Location *</Label>
                <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
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
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            
            {/* Free Delivery Message */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">
                <strong>Free Delivery!</strong>
              </p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={(value: "cash" | "bkash" | "ssl") => setPaymentMethod(value)}>
              {/* Cash on Delivery */}
              {paymentSettings?.cod_enabled && (
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <span className="font-medium">Cash on Delivery</span>
                  </Label>
                </div>
              )}

              {/* bKash */}
              {paymentSettings?.bkash_enabled && (
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="bkash" id="bkash" />
                  <Label htmlFor="bkash" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">bKash</span>
                    </div>
                    <p className="text-sm text-gray-500">Pay with bKash mobile wallet</p>
                  </Label>
                </div>
              )}

              {/* SSL Commerz */}
              {paymentSettings?.ssl_enabled && (
                <div className="flex items-center space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value="ssl" id="ssl" />
                  <Label htmlFor="ssl" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">SSL Commerz</span>
                    </div>
                    <p className="text-sm text-gray-500">Pay with card, mobile banking, or net banking</p>
                  </Label>
                </div>
              )}
            </RadioGroup>

            {/* Payment Constraints Warning */}
            {paymentMethod === "cash" && paymentSettings && (
              <div className="mt-4">
                {totalAmount < paymentSettings.cod_min_order && (
                  <p className="text-red-600 text-sm">
                    Minimum order amount for Cash on Delivery is ৳{paymentSettings.cod_min_order}
                  </p>
                )}
                {totalAmount > paymentSettings.cod_max_order && (
                  <p className="text-red-600 text-sm">
                    Maximum order amount for Cash on Delivery is ৳{paymentSettings.cod_max_order}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          
          <Card className="p-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-medium">৳{(item.product.price * item.quantity * 110).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{bdtSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>৳{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-kazi-red">৳{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Button 
            onClick={handlePlaceOrder} 
            className="w-full bg-kazi-green hover:bg-kazi-light-green text-white"
            size="lg"
          >
            Place Order - ৳{totalAmount.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeekendMenuCheckout;
