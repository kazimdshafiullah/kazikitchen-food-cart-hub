
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, CheckCircle, AlertTriangle, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock orders data for kitchen
const mockKitchenOrders = [
  {
    id: "ORD-1001",
    customer: "John Doe",
    time: "10:30 AM",
    items: [
      { name: "Chicken Biryani", quantity: 2, cookingTime: 25 },
      { name: "Vegetable Curry", quantity: 1, cookingTime: 15 },
      { name: "Naan Bread", quantity: 3, cookingTime: 8 }
    ],
    status: "pending",
    priority: "high"
  },
  {
    id: "ORD-1002",
    customer: "Sarah Lee",
    time: "10:45 AM",
    items: [
      { name: "Fish Curry", quantity: 1, cookingTime: 20 },
      { name: "Rice", quantity: 2, cookingTime: 15 }
    ],
    status: "cooking",
    priority: "normal"
  },
  {
    id: "ORD-1003",
    customer: "Mike Chen",
    time: "11:00 AM",
    items: [
      { name: "Paneer Tikka", quantity: 1, cookingTime: 18 },
      { name: "Garlic Naan", quantity: 2, cookingTime: 8 }
    ],
    status: "pending",
    priority: "normal"
  }
];

const KitchenDashboard = () => {
  const [orders, setOrders] = useState(mockKitchenOrders);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    const statusMessages = {
      cooking: "Order started cooking",
      ready: "Order is ready for pickup",
      completed: "Order completed"
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[newStatus as keyof typeof statusMessages]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cooking": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "high" ? "destructive" : "secondary";
  };

  const pendingOrders = orders.filter(order => order.status === "pending");
  const cookingOrders = orders.filter(order => order.status === "cooking");
  const readyOrders = orders.filter(order => order.status === "ready");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kitchen Dashboard</h2>
        <p className="text-muted-foreground">Manage food preparation and order status</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cooking</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cookingOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id} className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <Badge variant={getPriorityColor(order.priority)}>
                    {order.priority === "high" ? "URGENT" : "NORMAL"}
                  </Badge>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {order.time}
                </div>
              </div>
              <CardDescription>Customer: {order.customer}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.quantity}x {item.name}</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        <span>{item.cookingTime} min</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-2">
                  {order.status === "pending" && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, "cooking")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ChefHat className="h-4 w-4 mr-2" />
                      Start Cooking
                    </Button>
                  )}
                  {order.status === "cooking" && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Ready
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button 
                      onClick={() => updateOrderStatus(order.id, "completed")}
                      variant="outline"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenDashboard;
