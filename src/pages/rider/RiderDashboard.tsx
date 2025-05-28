
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, FileText, Navigation, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock assigned orders for rider
const mockRiderOrders = [
  {
    id: "ORD-1001",
    customer: "John Doe",
    phone: "+8801234567890",
    address: "123 Dhanmondi, Dhaka, Bangladesh",
    total: 1149.75,
    status: "ready_for_pickup",
    estimatedTime: "25 min",
    distance: "2.5 km"
  },
  {
    id: "ORD-1004",
    customer: "Emily Wong",
    phone: "+8801234567891",
    address: "456 Gulshan, Dhaka, Bangladesh",
    total: 3100.00,
    status: "out_for_delivery",
    estimatedTime: "15 min",
    distance: "1.8 km"
  }
];

const RiderDashboard = () => {
  const [orders, setOrders] = useState(mockRiderOrders);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    const statusMessages = {
      picked_up: "Order picked up from restaurant",
      out_for_delivery: "Order is out for delivery",
      delivered: "Order delivered successfully"
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[newStatus as keyof typeof statusMessages]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_for_pickup": return "bg-yellow-100 text-yellow-800";
      case "picked_up": return "bg-blue-100 text-blue-800";
      case "out_for_delivery": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready_for_pickup": return "Ready for Pickup";
      case "picked_up": return "Picked Up";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      default: return status;
    }
  };

  const readyOrders = orders.filter(order => order.status === "ready_for_pickup");
  const activeOrders = orders.filter(order => order.status === "out_for_delivery" || order.status === "picked_up");
  const completedOrders = orders.filter(order => order.status === "delivered");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Deliveries</h2>
        <p className="text-muted-foreground">Manage your assigned delivery orders</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Orders */}
      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id} className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ৳{order.total.toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <strong>Customer:</strong> {order.customer}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">
                        {order.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span className="text-sm">{order.address}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div><strong>Distance:</strong> {order.distance}</div>
                    <div><strong>Est. Time:</strong> {order.estimatedTime}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {order.status === "ready_for_pickup" && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, "picked_up")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Picked Up
                    </Button>
                  )}
                  
                  {order.status === "picked_up" && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, "out_for_delivery")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Start Delivery
                    </Button>
                  )}
                  
                  {order.status === "out_for_delivery" && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, "delivered")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}
                  
                  <Button variant="outline" asChild>
                    <Link to={`/invoice/${order.id}`} target="_blank">
                      <FileText className="h-4 w-4 mr-2" />
                      View Invoice
                    </Link>
                  </Button>
                  
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No deliveries assigned</h3>
            <p className="text-gray-500">You don't have any orders assigned to you at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiderDashboard;
