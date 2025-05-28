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
import { Check, Eye, Search, Filter, FileText, Send, Clock, AlertTriangle, MessageCircle, ChefHat, CheckCircle, Plus, User, Truck } from "lucide-react";
import KitchenPreparation from "@/components/KitchenPreparation";
import ManualOrderCreation from "@/components/ManualOrderCreation";

// Enhanced mock data with kitchen and rider status tracking
const mockOrders = [
  { 
    id: "ORD-1001", 
    customer: "John Doe", 
    date: "2025-05-20", 
    total: 1149.75, 
    status: "pending", 
    source: "website", 
    isFake: false,
    kitchenStatus: "not_started",
    riderStatus: "not_assigned",
    assignedRider: null,
    approvedAt: null,
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 400 },
      { name: "Vegetable Curry", quantity: 1, price: 250 }
    ]
  },
  { 
    id: "ORD-1002", 
    customer: "Sarah Lee", 
    date: "2025-05-20", 
    total: 1962.50, 
    status: "approved", 
    source: "website", 
    isFake: false,
    kitchenStatus: "cooking",
    riderStatus: "not_assigned",
    assignedRider: null,
    approvedAt: "2025-05-20 10:45 AM",
    items: [
      { name: "Fish Curry", quantity: 1, price: 350 },
      { name: "Rice", quantity: 2, price: 150 }
    ]
  },
  { 
    id: "ORD-1003", 
    customer: "Mike Chen", 
    date: "2025-05-19", 
    total: 593.75, 
    status: "approved", 
    source: "meta", 
    isFake: false,
    kitchenStatus: "ready",
    riderStatus: "assigned",
    assignedRider: "Rider-001 (John Smith)",
    approvedAt: "2025-05-19 11:30 AM",
    items: [
      { name: "Paneer Tikka", quantity: 1, price: 300 }
    ]
  },
  { 
    id: "ORD-1004", 
    customer: "Emily Wong", 
    date: "2025-05-19", 
    total: 3100.00, 
    status: "approved", 
    source: "website", 
    isFake: false,
    kitchenStatus: "completed",
    riderStatus: "picked_up",
    assignedRider: "Rider-002 (Mike Johnson)",
    approvedAt: "2025-05-19 09:15 AM",
    items: [
      { name: "Mixed Platter", quantity: 1, price: 800 }
    ]
  },
  { 
    id: "ORD-1005", 
    customer: "Alex Johnson", 
    date: "2025-05-18", 
    total: 1681.25, 
    status: "delivered", 
    source: "meta", 
    isFake: false,
    kitchenStatus: "completed",
    riderStatus: "delivered",
    assignedRider: "Rider-001 (John Smith)",
    approvedAt: "2025-05-18 02:20 PM",
    items: [
      { name: "Chicken Biryani", quantity: 3, price: 600 }
    ]
  }
];

// Mock riders data
const mockRiders = [
  { id: "Rider-001", name: "John Smith", status: "available" },
  { id: "Rider-002", name: "Mike Johnson", status: "busy" },
  { id: "Rider-003", name: "Sarah Wilson", status: "available" },
];

// Order details dialog component
const OrderDetails = ({ order, open, onClose, onUpdateOrder }: { 
  order: any; 
  open: boolean; 
  onClose: () => void;
  onUpdateOrder: (orderId: string, updates: any) => void;
}) => {
  if (!order) return null;
  
  const handleApproveOrder = () => {
    onUpdateOrder(order.id, { 
      status: "approved", 
      approvedAt: new Date().toLocaleString(),
      kitchenStatus: "pending"
    });
    toast({
      title: "Order Approved",
      description: `Order ${order.id} has been approved and sent to kitchen!`
    });
  };
  
  const handleAssignRider = (riderId: string) => {
    const rider = mockRiders.find(r => r.id === riderId);
    onUpdateOrder(order.id, { 
      assignedRider: `${riderId} (${rider?.name})`,
      riderStatus: "assigned"
    });
    toast({
      title: "Rider Assigned",
      description: `${rider?.name} has been assigned to order ${order.id}`
    });
  };
  
  const handleMarkAsFake = () => {
    onUpdateOrder(order.id, { isFake: true });
    toast({
      title: "Order Marked as Fake",
      description: `Order ${order.id} has been marked as fake`
    });
  };
  
  const getKitchenStatusColor = (status: string) => {
    switch (status) {
      case "not_started": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cooking": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "completed": return "bg-green-200 text-green-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getRiderStatusColor = (status: string) => {
    switch (status) {
      case "not_assigned": return "bg-gray-100 text-gray-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "picked_up": return "bg-yellow-100 text-yellow-800";
      case "delivering": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
          <DialogDescription>Complete order management and tracking</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Basic Info */}
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
              <Badge className={`capitalize ${
                order.status === "delivered" ? "bg-green-100 text-green-800" :
                order.status === "approved" ? "bg-blue-100 text-blue-800" :
                order.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                "bg-red-100 text-red-800"
              }`}>
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Kitchen & Rider Status */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="h-4 w-4" />
                <p className="text-sm font-medium">Kitchen Status</p>
              </div>
              <Badge className={getKitchenStatusColor(order.kitchenStatus)}>
                {order.kitchenStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4" />
                <p className="text-sm font-medium">Delivery Status</p>
              </div>
              <Badge className={getRiderStatusColor(order.riderStatus)}>
                {order.riderStatus.replace('_', ' ').toUpperCase()}
              </Badge>
              {order.assignedRider && (
                <p className="text-xs text-muted-foreground mt-1">
                  Assigned to: {order.assignedRider}
                </p>
              )}
            </div>
          </div>
          
          {/* Order Items */}
          <div>
            <p className="text-sm font-medium mb-2">Order Items</p>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                  <span>{item.quantity}x {item.name}</span>
                  <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            {order.status === "pending" && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleApproveOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Order
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
            )}
            
            {order.status === "approved" && order.kitchenStatus === "ready" && order.riderStatus === "not_assigned" && (
              <div>
                <p className="text-sm font-medium mb-2">Assign Delivery Rider</p>
                <Select onValueChange={handleAssignRider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rider" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRiders.filter(rider => rider.status === "available").map(rider => (
                      <SelectItem key={rider.id} value={rider.id}>
                        {rider.name} ({rider.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="flex justify-between pt-2 border-t">
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
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [fakeFilter, setFakeFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  
  const handleUpdateOrder = (orderId: string, updates: any) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
    const matchesSource = sourceFilter === "all" ? true : order.source === sourceFilter;
    const matchesFake = fakeFilter === "all" ? true : 
      fakeFilter === "fake" ? order.isFake : !order.isFake;
    
    return matchesSearch && matchesStatus && matchesSource && matchesFake;
  });
  
  const pendingOrderCount = orders.filter(order => order.status === "pending").length;
  const fakeOrderCount = orders.filter(order => order.isFake).length;
  const approvedOrderCount = orders.filter(order => order.status === "approved").length;
  const readyForDeliveryCount = orders.filter(order => 
    order.kitchenStatus === "ready" && order.riderStatus === "not_assigned"
  ).length;
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };
  
  const handleCreateManualOrder = (newOrder: any) => {
    console.log("New manual order created:", newOrder);
  };
  
  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Orders Management</h2>
            <p className="text-gray-600 mt-2">Complete order lifecycle management from approval to delivery</p>
          </div>
          <Button 
            onClick={() => setIsManualOrderOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Manual Order
          </Button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrderCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting manual approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Kitchen</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{approvedOrderCount}</div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready for Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyForDeliveryCount}</div>
            <p className="text-xs text-muted-foreground">Needs rider assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fake Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{fakeOrderCount}</div>
            <p className="text-xs text-muted-foreground">Flagged orders</p>
          </CardContent>
        </Card>
      </div>
      
      <KitchenPreparation />
      
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded-lg shadow-sm">
          <Filter className="h-4 w-4 text-gray-400" />
          
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="font-medium text-amber-800">You have {pendingOrderCount} pending order{pendingOrderCount !== 1 ? 's' : ''} awaiting confirmation</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            View Pending
          </Button>
        </div>
      )}
      
      {fakeOrderCount > 0 && fakeFilter !== "fake" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-800">You have {fakeOrderCount} fake order{fakeOrderCount !== 1 ? 's' : ''} detected</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFakeFilter("fake")}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            View Fake Orders
          </Button>
        </div>
      )}
      
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Total (BDT)</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Kitchen</TableHead>
              <TableHead className="font-semibold">Delivery</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id} className={`hover:bg-gray-50 ${order.isFake ? "bg-red-50" : ""}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {order.id}
                    {order.isFake && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="font-medium">৳{order.total.toLocaleString('en-BD')}</TableCell>
                <TableCell>
                  <Badge className={`capitalize ${
                    order.status === "delivered" ? "bg-green-100 text-green-800" :
                    order.status === "approved" ? "bg-blue-100 text-blue-800" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${
                    order.kitchenStatus === "completed" ? "bg-green-100 text-green-800" :
                    order.kitchenStatus === "ready" ? "bg-green-100 text-green-700" :
                    order.kitchenStatus === "cooking" ? "bg-blue-100 text-blue-800" :
                    order.kitchenStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {order.kitchenStatus?.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${
                    order.riderStatus === "delivered" ? "bg-green-100 text-green-800" :
                    order.riderStatus === "delivering" ? "bg-orange-100 text-orange-800" :
                    order.riderStatus === "picked_up" ? "bg-yellow-100 text-yellow-800" :
                    order.riderStatus === "assigned" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {order.riderStatus?.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewOrder(order)}
                    className="hover:bg-blue-100"
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
        onUpdateOrder={handleUpdateOrder}
      />
      
      <ManualOrderCreation 
        open={isManualOrderOpen}
        onClose={() => setIsManualOrderOpen(false)}
        onOrderCreated={handleCreateManualOrder}
      />
    </div>
  );
};

export default Orders;
