
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ManualOrderCreationProps = {
  open: boolean;
  onClose: () => void;
  onOrderCreated: (order: any) => void;
};

const availableItems = [
  { id: "1", name: "Chicken Biryani", price: 350 },
  { id: "2", name: "Beef Curry", price: 450 },
  { id: "3", name: "Vegetable Curry", price: 250 },
  { id: "4", name: "Fish Curry", price: 400 },
  { id: "5", name: "Dal", price: 150 },
  { id: "6", name: "Rice", price: 80 },
  { id: "7", name: "Naan", price: 60 },
  { id: "8", name: "Roti", price: 40 },
  { id: "9", name: "Chicken Kebab", price: 300 },
  { id: "10", name: "Mutton Curry", price: 550 }
];

const ManualOrderCreation = ({ open, onClose, onOrderCreated }: ManualOrderCreationProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryFee, setDeliveryFee] = useState(50);

  const addItem = () => {
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "Please select an item"
      });
      return;
    }
    
    const item = availableItems.find(i => i.id === selectedItem);
    if (!item) return;
    
    const existingItemIndex = orderItems.findIndex(oi => oi.id === selectedItem);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderItems(updatedItems);
    } else {
      setOrderItems([...orderItems, {
        id: selectedItem,
        name: item.name,
        price: item.price,
        quantity: quantity
      }]);
    }
    
    setSelectedItem("");
    setQuantity(1);
  };

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    const itemsTotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return itemsTotal + deliveryFee;
  };

  const handleCreateOrder = () => {
    if (!customerName || !customerPhone || orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in customer details and add at least one item"
      });
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const newOrder = {
      id: orderId,
      customer: customerName,
      phone: customerPhone,
      address: customerAddress,
      date: new Date().toISOString().split('T')[0],
      total: calculateTotal(),
      status: "pending",
      source: "manual",
      isFake: false,
      items: orderItems,
      deliveryFee: deliveryFee
    };

    onOrderCreated(newOrder);
    
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setOrderItems([]);
    setDeliveryFee(50);
    
    toast({
      title: "Success",
      description: `Order ${orderId} created successfully!`
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Create Manual Order
          </DialogTitle>
          <DialogDescription>
            Create a new order manually for walk-in customers or phone orders
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer Name *</label>
                  <Input 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Delivery Address</label>
                <Input 
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter delivery address (optional for pickup)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Add Items</h3>
              <div className="flex gap-2">
                <select 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">Select Item</option>
                  {availableItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ৳{item.price}
                    </option>
                  ))}
                </select>
                <Input 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20"
                  placeholder="Qty"
                />
                <Button onClick={addItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          {orderItems.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Order Items</h3>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">৳{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                        />
                        <Badge variant="outline">৳{item.price * item.quantity}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>৳{orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Fee:</span>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      min="0"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                      className="w-20 text-right"
                    />
                  </div>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>৳{calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrder}>
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualOrderCreation;
