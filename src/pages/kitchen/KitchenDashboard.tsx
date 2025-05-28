
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, CheckCircle, AlertTriangle, Timer, Package } from "lucide-react";
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
      { name: "Rice", quantity: 2, cookingTime: 15 },
      { name: "Chicken Biryani", quantity: 1, cookingTime: 25 }
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
      { name: "Garlic Naan", quantity: 2, cookingTime: 8 },
      { name: "Vegetable Curry", quantity: 1, cookingTime: 15 }
    ],
    status: "pending",
    priority: "normal"
  },
  {
    id: "ORD-1004",
    customer: "Emma Wilson",
    time: "11:15 AM",
    items: [
      { name: "Chicken Biryani", quantity: 1, cookingTime: 25 },
      { name: "Naan Bread", quantity: 2, cookingTime: 8 }
    ],
    status: "pending",
    priority: "high"
  }
];

const KitchenDashboard = () => {
  const [orders, setOrders] = useState(mockKitchenOrders);
  const [activeView, setActiveView] = useState<'orders' | 'items'>('orders');

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

  // Calculate item totals across all active orders
  const getItemTotals = () => {
    const itemTotals: Record<string, { total: number; orders: string[]; avgCookingTime: number }> = {};
    
    orders.forEach(order => {
      if (order.status !== "completed") {
        order.items.forEach(item => {
          if (!itemTotals[item.name]) {
            itemTotals[item.name] = { total: 0, orders: [], avgCookingTime: item.cookingTime };
          }
          itemTotals[item.name].total += item.quantity;
          itemTotals[item.name].orders.push(order.id);
        });
      }
    });
    
    return Object.entries(itemTotals).map(([name, data]) => ({
      name,
      total: data.total,
      orders: [...new Set(data.orders)],
      avgCookingTime: data.avgCookingTime
    }));
  };

  const pendingOrders = orders.filter(order => order.status === "pending");
  const cookingOrders = orders.filter(order => order.status === "cooking");
  const readyOrders = orders.filter(order => order.status === "ready");
  const itemTotals = getItemTotals();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kitchen Dashboard</h2>
        <p className="text-muted-foreground">Manage food preparation and order status</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button 
          variant={activeView === 'orders' ? 'default' : 'outline'}
          onClick={() => setActiveView('orders')}
        >
          <Package className="h-4 w-4 mr-2" />
          Orders View
        </Button>
        <Button 
          variant={activeView === 'items' ? 'default' : 'outline'}
          onClick={() => setActiveView('items')}
        >
          <ChefHat className="h-4 w-4 mr-2" />
          Items Summary
        </Button>
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
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemTotals.reduce((sum, item) => sum + item.total, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Items Summary View */}
      {activeView === 'items' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Items to Prepare - Summary</h3>
          <div className="grid gap-4">
            {itemTotals.map((item, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <ChefHat className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Total quantity needed: <span className="font-medium text-orange-600">{item.total}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          From orders: {item.orders.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        <span>{item.avgCookingTime} min each</span>
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        Est. {item.avgCookingTime * item.total} min total
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Orders View */}
      {activeView === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Active Orders</h3>
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
      )}
    </div>
  );
};

export default KitchenDashboard;
