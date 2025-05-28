
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Package, Truck, CheckCircle, Clock, ArrowLeft } from "lucide-react";

// Mock order data for tracking
const getOrderForTracking = (orderId: string) => {
  const mockOrders = [
    { 
      id: "ORD-1001", 
      customer: "John Doe", 
      date: "2025-05-20", 
      status: "delivered",
      items: [
        { name: "Vegetable Curry", quantity: 2, price: 300.00 },
        { name: "Chicken Biryani", quantity: 1, price: 324.75 }
      ],
      total: 1149.75,
      estimatedDelivery: "45-60 minutes",
      address: "123 Dhanmondi, Dhaka, Bangladesh"
    },
    { 
      id: "ORD-1002", 
      customer: "Sarah Lee", 
      date: "2025-05-20", 
      status: "processing",
      items: [
        { name: "Paneer Tikka", quantity: 1, price: 362.50 },
        { name: "Garlic Naan", quantity: 2, price: 100.00 }
      ],
      total: 1962.50,
      estimatedDelivery: "30-45 minutes",
      address: "456 Gulshan, Dhaka, Bangladesh"
    },
    { 
      id: "ORD-1003", 
      customer: "Mike Chen", 
      date: "2025-05-19", 
      status: "shipped",
      items: [
        { name: "Fish Curry", quantity: 1, price: 450.00 },
        { name: "Rice", quantity: 2, price: 71.875 }
      ],
      total: 593.75,
      estimatedDelivery: "20-30 minutes",
      address: "789 Uttara, Dhaka, Bangladesh"
    }
  ];
  
  return mockOrders.find(order => order.id === orderId);
};

const getStatusInfo = (status: string) => {
  const statusMap = {
    pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800", text: "Order Received" },
    processing: { icon: Package, color: "bg-blue-100 text-blue-800", text: "Being Prepared" },
    shipped: { icon: Truck, color: "bg-purple-100 text-purple-800", text: "Out for Delivery" },
    delivered: { icon: CheckCircle, color: "bg-green-100 text-green-800", text: "Delivered" }
  };
  
  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderForTracking(orderId);
      setOrder(orderData);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find an order with ID: {orderId}</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Order Header */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <Badge className={statusInfo.color}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {statusInfo.text}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Estimated Delivery</p>
                <p className="font-medium">{order.estimatedDelivery}</p>
              </div>
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{order.customer}</p>
              </div>
              <div>
                <p className="text-gray-500">Delivery Address</p>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
          </Card>

          {/* Order Status Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
            <div className="space-y-4">
              {[
                { status: 'pending', label: 'Order Received', time: '2 hours ago' },
                { status: 'processing', label: 'Being Prepared', time: '1 hour ago' },
                { status: 'shipped', label: 'Out for Delivery', time: '30 mins ago' },
                { status: 'delivered', label: 'Delivered', time: '' }
              ].map((step, index) => {
                const isActive = order.status === step.status;
                const isPast = ['pending', 'processing', 'shipped'].indexOf(order.status) > index;
                const stepStatus = getStatusInfo(step.status);
                const StepIcon = stepStatus.icon;
                
                return (
                  <div key={step.status} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive || isPast ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <StepIcon className={`h-4 w-4 ${
                        isActive || isPast ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isActive || isPast ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                      {step.time && (isActive || isPast) && (
                        <p className="text-sm text-gray-500">{step.time}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" asChild>
                <Link to={`/invoice/${order.id}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
