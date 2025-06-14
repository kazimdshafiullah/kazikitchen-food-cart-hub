import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, MapPin, Calendar, Phone, Mail, User, Eye } from "lucide-react";

// Mock order data with updated delivery locations
const mockOrders = [
  {
    id: "ORD-1001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+8801234567890",
    deliveryAddress: "House 12, Road 5, Block A",
    deliveryLocation: "Dhanmondi",
    totalAmount: 850,
    status: "pending",
    orderDate: "2025-01-15",
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 350 },
      { name: "Beef Curry", quantity: 1, price: 250 }
    ]
  },
  {
    id: "ORD-1002",
    customerName: "Sarah Ahmed",
    customerEmail: "sarah@example.com",
    customerPhone: "+8801234567891",
    deliveryAddress: "Apartment 4B, Green Tower",
    deliveryLocation: "Elephant Road",
    totalAmount: 650,
    status: "confirmed",
    orderDate: "2025-01-15",
    items: [
      { name: "Fish Curry", quantity: 1, price: 300 },
      { name: "Rice", quantity: 2, price: 150 }
    ]
  },
  {
    id: "ORD-1003",
    customerName: "Mike Rahman",
    customerEmail: "mike@example.com",
    customerPhone: "+8801234567892",
    deliveryAddress: "Shop 25, Level 3",
    deliveryLocation: "Mirpur Road",
    totalAmount: 720,
    status: "processing",
    orderDate: "2025-01-14",
    items: [
      { name: "Mutton Curry", quantity: 1, price: 450 },
      { name: "Vegetable Curry", quantity: 1, price: 270 }
    ]
  },
  {
    id: "ORD-1004",
    customerName: "Lisa Khan",
    customerEmail: "lisa@example.com",
    customerPhone: "+8801234567893",
    deliveryAddress: "House 8, Lane 2",
    deliveryLocation: "Zigatola",
    totalAmount: 920,
    status: "delivered",
    orderDate: "2025-01-14",
    items: [
      { name: "Special Biryani", quantity: 1, price: 500 },
      { name: "Chicken Roast", quantity: 1, price: 420 }
    ]
  },
  {
    id: "ORD-1005",
    customerName: "Ahmed Hassan",
    customerEmail: "ahmed@example.com",
    customerPhone: "+8801234567894",
    deliveryAddress: "Office Building, Floor 5",
    deliveryLocation: "Lalmatia",
    totalAmount: 580,
    status: "cancelled",
    orderDate: "2025-01-13",
    items: [
      { name: "Dal Curry", quantity: 2, price: 200 },
      { name: "Chicken Curry", quantity: 1, price: 380 }
    ]
  }
];

const deliveryLocations = [
  "All Locations",
  "Dhanmondi",
  "Farmgate", 
  "Panthapath",
  "Karwanbazar",
  "New Market",
  "Banglamotor",
  "Shahbag",
  "Science Lab",
  "Elephant Road",
  "Mirpur Road",
  "Zigatola",
  "Lalmatia"
];

const orderStatuses = [
  "All Status",
  "pending",
  "confirmed", 
  "processing",
  "out-for-delivery",
  "delivered",
  "cancelled"
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-purple-100 text-purple-800";
      case "out-for-delivery": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
    const matchesLocation = locationFilter === "All Locations" || order.deliveryLocation === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="text-sm text-gray-500">
          Total Orders: {filteredOrders.length}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by Order ID, Name, or Email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Filter by Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue />
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
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Kitchen</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status === 'pending' ? 'pending' : order.status === 'confirmed' ? 'confirmed' : order.status === 'processing' ? 'processing' : 'delivered')}>
                      {order.status === 'pending' ? 'not started' : 
                       order.status === 'confirmed' ? 'confirmed' :
                       order.status === 'processing' ? 'cooking' : 
                       order.status === 'delivered' ? 'completed' : 
                       order.status === 'out-for-delivery' ? 'ready' : order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status === 'delivered' ? 'delivered' : order.status === 'out-for-delivery' ? 'out-for-delivery' : 'pending')}>
                      {order.status === 'delivered' ? 'delivered' : 
                       order.status === 'out-for-delivery' ? 'out for delivery' : 
                       order.status === 'processing' ? 'preparing' :
                       'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{order.deliveryLocation}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.slice(1).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>৳{order.totalAmount}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Card className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Details - {selectedOrder.id}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{selectedOrder.orderDate}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h3 className="font-semibold mb-3">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{selectedOrder.deliveryLocation}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedOrder.deliveryAddress}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>৳{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-semibold">
                    <span>Total Amount</span>
                    <span>৳{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-3">Update Status</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    updateOrderStatus(selectedOrder.id, value);
                    setSelectedOrder({...selectedOrder, status: value});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.slice(1).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
