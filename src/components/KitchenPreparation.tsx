
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  ChefHat, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  Timer,
  Utensils,
  Check
} from "lucide-react";

// Mock data for active orders
const mockOrders = [
  { id: "ORD-1001", customer: "John Doe", status: "confirmed", orderTime: "10:30 AM" },
  { id: "ORD-1002", customer: "Sarah Lee", status: "processing", orderTime: "10:45 AM" },
  { id: "ORD-1003", customer: "Mike Chen", status: "confirmed", orderTime: "11:00 AM" },
  { id: "ORD-1005", customer: "Alex Johnson", status: "processing", orderTime: "11:15 AM" },
];

// Generate kitchen items for active orders
const getKitchenItems = () => {
  const activeOrders = mockOrders.filter(order => 
    order.status === "confirmed" || order.status === "processing"
  );
  
  const kitchenItems = [];
  activeOrders.forEach(order => {
    // Mock items for each order with preparation time
    kitchenItems.push(
      { 
        orderId: order.id, 
        customer: order.customer,
        item: "Chicken Biryani", 
        quantity: 2, 
        priority: order.status === "confirmed" ? "high" : "normal",
        estimatedTime: 25,
        orderTime: order.orderTime,
        category: "main"
      },
      { 
        orderId: order.id, 
        customer: order.customer,
        item: "Vegetable Curry", 
        quantity: 1, 
        priority: order.status === "confirmed" ? "high" : "normal",
        estimatedTime: 15,
        orderTime: order.orderTime,
        category: "curry"
      },
      { 
        orderId: order.id, 
        customer: order.customer,
        item: "Naan Bread", 
        quantity: 3, 
        priority: order.status === "confirmed" ? "high" : "normal",
        estimatedTime: 8,
        orderTime: order.orderTime,
        category: "bread"
      }
    );
  });
  
  return kitchenItems;
};

const KitchenPreparation = () => {
  const [kitchenItems, setKitchenItems] = useState(getKitchenItems());
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [inProgressItems, setInProgressItems] = useState<string[]>([]);
  
  const handleStartCooking = (orderId: string, item: string) => {
    const itemKey = `${orderId}-${item}`;
    setInProgressItems([...inProgressItems, itemKey]);
    toast({
      title: "Cooking Started",
      description: `Started preparing ${item} for order ${orderId}`
    });
  };
  
  const handleMarkComplete = (orderId: string, item: string) => {
    const itemKey = `${orderId}-${item}`;
    setCompletedItems([...completedItems, itemKey]);
    setInProgressItems(inProgressItems.filter(id => id !== itemKey));
    toast({
      title: "Item Completed",
      description: `${item} for order ${orderId} is ready for serving`
    });
  };
  
  const isItemCompleted = (orderId: string, item: string) => {
    return completedItems.includes(`${orderId}-${item}`);
  };
  
  const isItemInProgress = (orderId: string, item: string) => {
    return inProgressItems.includes(`${orderId}-${item}`);
  };
  
  const getItemStatus = (orderId: string, item: string) => {
    if (isItemCompleted(orderId, item)) return "completed";
    if (isItemInProgress(orderId, item)) return "cooking";
    return "pending";
  };
  
  const getPriorityColor = (priority: string) => {
    return priority === "high" ? "destructive" : "secondary";
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "main": return <Utensils className="h-4 w-4" />;
      case "curry": return <ChefHat className="h-4 w-4" />;
      case "bread": return <Timer className="h-4 w-4" />;
      default: return <ChefHat className="h-4 w-4" />;
    }
  };
  
  // Group items by order for better organization
  const groupedItems = kitchenItems.reduce((acc, item) => {
    if (!acc[item.orderId]) {
      acc[item.orderId] = {
        orderId: item.orderId,
        customer: item.customer,
        orderTime: item.orderTime,
        items: []
      };
    }
    acc[item.orderId].items.push(item);
    return acc;
  }, {} as Record<string, any>);
  
  const totalItems = kitchenItems.length;
  const completedCount = completedItems.length;
  const inProgressCount = inProgressItems.length;
  const pendingCount = totalItems - completedCount - inProgressCount;
  
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-6 w-6" />
          Kitchen Preparation Dashboard
        </CardTitle>
        <CardDescription className="text-orange-100">
          Manage food preparation for active orders efficiently
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
            <div className="text-sm text-blue-500">Total Items</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <div className="text-sm text-orange-500">Pending</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
            <div className="text-sm text-yellow-500">Cooking</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-green-500">Ready</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round((completedCount / totalItems) * 100)}% Complete</span>
          </div>
          <Progress value={(completedCount / totalItems) * 100} className="h-3" />
        </div>
        
        {/* Kitchen Items by Order */}
        <div className="space-y-6">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No items to prepare</p>
              <p className="text-gray-400 text-sm">All orders are completed or no active orders</p>
            </div>
          ) : (
            Object.values(groupedItems).map((orderGroup: any) => (
              <div key={orderGroup.orderId} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-medium">
                      {orderGroup.orderId}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{orderGroup.customer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Ordered at {orderGroup.orderTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {orderGroup.items.map((item: any, index: number) => {
                    const status = getItemStatus(item.orderId, item.item);
                    
                    return (
                      <div 
                        key={`${item.orderId}-${item.item}-${index}`}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                          status === "completed" ? 'bg-green-50 border-green-200' : 
                          status === "cooking" ? 'bg-yellow-50 border-yellow-200' :
                          'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(item.category)}
                            <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                              {item.priority === "high" ? "URGENT" : "NORMAL"}
                            </Badge>
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.quantity}x {item.item}
                            </p>
                            <p className="text-sm text-gray-500">
                              Est. cooking time: {item.estimatedTime} minutes
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {status === "completed" ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready to Serve
                            </Badge>
                          ) : status === "cooking" ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                                <Timer className="h-3 w-3 mr-1" />
                                Cooking...
                              </Badge>
                              <Button 
                                size="sm" 
                                onClick={() => handleMarkComplete(item.orderId, item.item)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark Ready
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleStartCooking(item.orderId, item.item)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <ChefHat className="h-4 w-4 mr-1" />
                              Start Cooking
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenPreparation;
