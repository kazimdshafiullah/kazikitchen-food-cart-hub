
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
import { toast } from "@/components/ui/sonner";
import { Eye, Search, Filter, FileText, Send } from "lucide-react";

// Mock data for demonstration
const mockOrders = [
  { id: "ORD-1001", customer: "John Doe", date: "2025-05-20", total: 45.99, status: "delivered" },
  { id: "ORD-1002", customer: "Sarah Lee", date: "2025-05-20", total: 78.50, status: "processing" },
  { id: "ORD-1003", customer: "Mike Chen", date: "2025-05-19", total: 23.75, status: "delivered" },
  { id: "ORD-1004", customer: "Emily Wong", date: "2025-05-19", total: 124.00, status: "shipped" },
  { id: "ORD-1005", customer: "Alex Johnson", date: "2025-05-18", total: 67.25, status: "processing" },
  { id: "ORD-1006", customer: "Lisa Garcia", date: "2025-05-18", total: 98.50, status: "cancelled" },
  { id: "ORD-1007", customer: "David Kim", date: "2025-05-17", total: 34.99, status: "delivered" },
  { id: "ORD-1008", customer: "Rachel Green", date: "2025-05-16", total: 55.25, status: "shipped" },
];

// Order details dialog component
const OrderDetails = ({ order, open, onClose }: { order: any; open: boolean; onClose: () => void }) => {
  if (!order) return null;
  
  const handleStatusChange = (newStatus: string) => {
    order.status = newStatus;
    
    // In a real app, you would update the database and then show a notification
    const notificationMessages = {
      processing: "Order status updated to 'Processing'. No notification sent.",
      confirmed: "Order confirmed! Customer notification sent.",
      shipped: "Order status updated to 'Shipped'. No notification sent.",
      delivered: "Order marked as delivered! Customer notification sent.",
      cancelled: "Order cancelled. Customer notification sent."
    };
    
    const message = notificationMessages[newStatus as keyof typeof notificationMessages] || "Order status updated";
    toast.success(message);
  };
  
  const handleSendNotification = () => {
    toast.success(`Notification sent to customer: ${order.customer}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order {order.id}</DialogTitle>
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
              <p className="text-sm text-muted-foreground">${order.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <div className={`capitalize inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                order.status === "delivered" ? "bg-green-100 text-green-800" :
                order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                order.status === "processing" ? "bg-yellow-100 text-yellow-800" : 
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
                <span>$24.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Chicken Biryani x 1</span>
                <span>$12.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>$5.00</span>
              </div>
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Update Status</p>
            <Select defaultValue={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter && statusFilter !== "all" ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
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
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <div className={`capitalize inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered" ? "bg-green-100 text-green-800" :
                    order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                    order.status === "processing" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status}
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
