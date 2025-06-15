
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MapPin, Eye } from "lucide-react";
import { Order, orderStatuses } from "@/types/order";

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewOrder,
  onUpdateOrderStatus,
}) => {
  console.log('OrderTable orders data:', orders); // Debug log to check data structure

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Order ID</TableHead>
                <TableHead className="w-[150px]">Customer</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[100px]">Kitchen</TableHead>
                <TableHead className="w-[100px]">Delivery</TableHead>
                <TableHead className="w-[140px]">Location</TableHead>
                <TableHead className="w-[120px]">Order Status</TableHead>
                <TableHead className="w-[100px]">Amount</TableHead>
                <TableHead className="w-[80px]">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                console.log('Order location data:', {
                  id: order.id,
                  deliveryLocation: order.deliveryLocation,
                  deliveryAddress: order.deliveryAddress
                }); // Debug individual order data
                
                return (
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
                      <Badge className={`text-xs ${
                        order.kitchenStatus === "completed" ? "bg-green-100 text-green-800" :
                        order.kitchenStatus === "ready" ? "bg-green-100 text-green-700" :
                        order.kitchenStatus === "cooking" ? "bg-blue-100 text-blue-800" :
                        order.kitchenStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status === 'pending' ? 'not started' : 
                         order.status === 'confirmed' ? 'confirmed' :
                         order.status === 'processing' ? 'cooking' : 
                         order.status === 'delivered' ? 'completed' : 
                         order.status === 'out-for-delivery' ? 'ready' : order.status}
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
                        {order.status === 'delivered' ? 'delivered' : 
                         order.status === 'out-for-delivery' ? 'out for delivery' : 
                         order.status === 'processing' ? 'preparing' :
                         'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {order.deliveryLocation || 'No location'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => onUpdateOrderStatus(order.id, value)}
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
                        onClick={() => onViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTable;
