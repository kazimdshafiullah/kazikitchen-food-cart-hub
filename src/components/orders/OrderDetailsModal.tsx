
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Phone, Mail, User, MapPin } from "lucide-react";
import { Order, orderStatuses } from "@/types/order";

interface OrderDetailsModalProps {
  selectedOrder: Order | null;
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  selectedOrder,
  onClose,
  onUpdateOrderStatus,
}) => {
  if (!selectedOrder) return null;

  return (
    <Card className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Details - {selectedOrder.id}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
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
                onUpdateOrderStatus(selectedOrder.id, value);
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
  );
};

export default OrderDetailsModal;
