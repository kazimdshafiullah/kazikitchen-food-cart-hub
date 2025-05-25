import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Check, Eye, Search, Filter, FileText, Send, Clock, AlertTriangle, MessageCircle, ChefHat, CheckCircle } from "lucide-react";

// Mock data for demonstration with BDT currency and Meta integration
const mockOrders = [
  { id: "ORD-1001", customer: "John Doe", date: "2025-05-20", total: 1150.75, status: "delivered", source: "website", isFake: false },
  { id: "ORD-1002", customer: "Sarah Lee", date: "2025-05-20", total: 1962.50, status: "processing", source: "website", isFake: false },
  { id: "ORD-1003", customer: "Mike Chen", date: "2025-05-19", total: 593.75, status: "delivered", source: "meta", isFake: false },
  { id: "ORD-1004", customer: "Emily Wong", date: "2025-05-19", total: 3100.00, status: "shipped", source: "website", isFake: false },
  { id: "ORD-1005", customer: "Alex Johnson", date: "2025-05-18", total: 1681.25, status: "processing", source: "meta", isFake: false },
  { id: "ORD-1006", customer: "Lisa Garcia", date: "2025-05-18", total: 2462.50, status: "cancelled", source: "website", isFake: true },
  { id: "ORD-1007", customer: "David Kim", date: "2025-05-17", total: 874.75, status: "delivered", source: "website", isFake: false },
  { id: "ORD-1008", customer: "Rachel Green", date: "2025-05-16", total: 1381.25, status: "shipped", source: "meta", isFake: false },
  { id: "ORD-1009", customer: "Taylor Swift", date: "2025-05-21", total: 1068.75, status: "pending", source: "website", isFake: false },
  { id: "ORD-1010", customer: "James Wilson", date: "2025-05-21", total: 1695.00, status: "pending", source: "meta", isFake: true },
];

// Order details dialog component
const OrderDetails = ({ order, open, onClose }: { order: any; open: boolean; onClose: () => void }) => {
  if (!order) return null;
  
  const handleStatusChange = (newStatus: string) => {
    order.status = newStatus;
    
    const notificationMessages = {
      pending: "Order is pending confirmation. No notification sent.",
      processing: "Order status updated to 'Processing'. Customer notification sent.",
      confirmed: "Order confirmed! Customer notification sent.",
      shipped: "Order status updated to 'Shipped'. Customer notification sent.",
      delivered: "Order marked as delivered! Customer notification sent.",
      cancelled: "Order cancelled. Customer notification sent."
    };
    
    const message = notificationMessages[newStatus as keyof typeof notificationMessages] || "Order status updated";
    toast({
      title: "Success",
      description: message
    });
  };
  
  const handleConfirmOrder = () => {
    order.status = "confirmed";
    toast({
      title: "Success",
      description: `Order ${order.id} confirmed! Customer has been notified.`
    });
  };
  
  const handleMarkAsFake = () => {
    order.isFake = true;
    toast({
      title: "Success", 
      description: `Order ${order.id} marked as fake and moved to fake orders list.`
    });
  };
  
  const handleSendNotification = () => {
    toast({
      title: "Success",
      description: `Notification sent to customer: ${order.customer}`
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order {order.id}
            {order.source === "meta" && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Meta
              </span>
            )}
            {order.isFake && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Fake
              </span>
            )}
          </DialogTitle>
          <DialogDescription>Order details and management</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Customer</p>
              <p className="text-sm text-muted-foreground">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Order Date</p>
              <p className="text-sm text-muted-foreground">{order.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total</p>
              <p className="text-sm text-muted-foreground">৳{order.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <div className={`capitalize inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                order.status === "delivered" ? "bg-green-100 text-green-800" :
                order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                order.status === "processing" || order.status === "confirmed" ? "bg-yellow-100 text-yellow-800" :
                order.status === "pending" ? "bg-purple-100 text-purple-800" : 
                "bg-red-100 text-red-800"
              }`}>
                {order.status}
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Order Items</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vegetable Curry x 2</span>
                <span>৳600.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Chicken Biryani x 1</span>
                <span>৳324.75</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>৳125.00</span>
              </div>
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {order.status === "pending" ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium">This order is awaiting confirmation</p>
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  onClick={handleConfirmOrder}
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Order
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleMarkAsFake}
                  className="flex-1"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Mark as Fake
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium mb-2">Update Status</p>
              <Select defaultValue={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSendNotification}
            >
              <Send className="mr-1 h-4 w-4" />
              Send Notification
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link to={`/admin/invoice/${order.id}`} target="_blank">
                <FileText className="mr-1 h-4 w-4" />
                View Invoice
              </Link>
            </Button>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Kitchen preparation items for active orders
const getKitchenItems = () => {
  const activeOrders = mockOrders.filter(order => 
    order.status === "confirmed" || order.status === "processing"
  );
  
  const kitchenItems = [];
  activeOrders.forEach(order => {
    // Mock items for each order
    kitchenItems.push(
      { orderId: order.id, item: "Vegetable Curry", quantity: 2, priority: order.status === "confirmed" ? "high" : "normal" },
      { orderId: order.id, item: "Chicken Biryani", quantity: 1, priority: order.status === "confirmed" ? "high" : "normal" }
    );
  });
  
  return kitchenItems;
};

const KitchenPreparation = () => {
  const [kitchenItems, setKitchenItems] = useState(getKitchenItems());
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  
  const handleMarkComplete = (orderId: string, item: string) => {
    const itemKey = `${orderId}-${item}`;
    setCompletedItems([...completedItems, itemKey]);
    toast({
      title: "Item Completed",
      description: `${item} for order ${orderId} marked as ready`
    });
  };
  
  const isItemCompleted = (orderId: string, item: string) => {
    return completedItems.includes(`${orderId}-${item}`);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Kitchen Preparation
        </CardTitle>
        <CardDescription>
          Items that need to be prepared for active orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {kitchenItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No items to prepare</p>
          ) : (
            kitchenItems.map((item, index) => (
              <div 
                key={`${item.orderId}-${item.item}-${index}`}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  isItemCompleted(item.orderId, item.item) ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>
                    {item.priority === "high" ? "URGENT" : "NORMAL"}
                  </Badge>
                  <div>
                    <p className="font-medium">{item.quantity}x {item.item}</p>
                    <p className="text-sm text-muted-foreground">Order: {item.orderId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isItemCompleted(item.orderId, item.item) ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkComplete(item.orderId, item.item)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Ready
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [fakeFilter, setFakeFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
    const matchesSource = sourceFilter === "all" ? true : order.source === sourceFilter;
    const matchesFake = fakeFilter === "all" ? true : 
      fakeFilter === "fake" ? order.isFake : !order.isFake;
    
    return matchesSearch && matchesStatus && matchesSource && matchesFake;
  });
  
  const pendingOrderCount = mockOrders.filter(order => order.status === "pending").length;
  const fakeOrderCount = mockOrders.filter(order => order.isFake).length;
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Manage customer orders and track delivery status</p>
      </div>
      
      <KitchenPreparation />
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center">
                  <span>Pending</span>
                  {pendingOrderCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingOrderCount}
                    </span>
                  )}
                </div>
              </SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="meta">Meta</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={fakeFilter} onValueChange={setFakeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Order Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="real">Real Orders</SelectItem>
              <SelectItem value="fake">
                <div className="flex items-center">
                  <span>Fake Orders</span>
                  {fakeOrderCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {fakeOrderCount}
                    </span>
                  )}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {pendingOrderCount > 0 && statusFilter !== "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span>You have {pendingOrderCount} pending order{pendingOrderCount !== 1 ? 's' : ''} awaiting confirmation</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            View Pending
          </Button>
        </div>
      )}
      
      {fakeOrderCount > 0 && fakeFilter !== "fake" && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>You have {fakeOrderCount} fake order{fakeOrderCount !== 1 ? 's' : ''} detected</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFakeFilter("fake")}
          >
            View Fake Orders
          </Button>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id} className={order.isFake ? "bg-red-50" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {order.id}
                    {order.isFake && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>৳{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <div className={`capitalize inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered" ? "bg-green-100 text-green-800" :
                    order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                    order.status === "processing" || order.status === "confirmed" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "pending" ? "bg-purple-100 text-purple-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`capitalize inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.source === "meta" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {order.source}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View order</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <OrderDetails 
        order={selectedOrder}
        open={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
      />
    </div>
  );
};

export default Orders;
