import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock order for demonstration - in a real app, fetch from your database
const getOrderDetails = (orderId: string) => {
  const mockOrders = [
    { 
      id: "ORD-1001", 
      customer: "John Doe", 
      email: "john@example.com",
      phone: "+8801234567890",
      address: "123 Dhanmondi, Dhaka, Bangladesh",
      date: "2025-05-20", 
      items: [
        { name: "Vegetable Curry", quantity: 2, price: 300.00 },
        { name: "Chicken Biryani", quantity: 1, price: 324.75 }
      ],
      shipping: 125.00,
      discount: 0,
      total: 1149.75, 
      status: "delivered",
      paymentMethod: "Cash on Delivery",
      source: "website"
    },
    { 
      id: "ORD-1002", 
      customer: "Sarah Lee", 
      email: "sarah@example.com",
      phone: "+8800987654321",
      address: "456 Gulshan, Dhaka, Bangladesh",
      date: "2025-05-20", 
      items: [
        { name: "Paneer Tikka", quantity: 1, price: 362.50 },
        { name: "Garlic Naan", quantity: 2, price: 100.00 },
        { name: "Mango Lassi", quantity: 2, price: 150.00 }
      ],
      shipping: 125.00,
      discount: 0,
      total: 1962.50, 
      status: "processing",
      paymentMethod: "bKash",
      source: "meta"
    },
  ];
  
  return mockOrders.find(order => order.id === orderId) || null;
};

const Invoice = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const orderData = getOrderDetails(id);
      setOrder(orderData);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-8">Loading invoice...</div>;
  if (!order) return <div className="p-8">Invoice not found</div>;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Success",
      description: "PDF download functionality would be implemented here",
    });
  };

  const calculateSubtotal = () => {
    return order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="print:hidden flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Invoice #{order.id}</h2>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="p-8 mb-6 bg-white">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-kazi-red">KAZI KITCHEN</h1>
            <p className="text-gray-500">123 Culinary Lane</p>
            <p className="text-gray-500">Dhaka, Bangladesh</p>
            <p className="text-gray-500">Phone: +880 1234-567890</p>
            <p className="text-gray-500">Email: info@kazikitchen.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">INVOICE</h2>
            <p className="text-gray-500">#{order.id}</p>
            <p className="text-gray-500"><strong>Date:</strong> {order.date}</p>
            <p className="text-gray-500"><strong>Status:</strong> {order.status}</p>
            {order.source && (
              <p className="text-gray-500"><strong>Source:</strong> {order.source}</p>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2 pb-2 border-b">Customer Information</h3>
          <div className="grid grid-cols-2">
            <div>
              <p><strong>Name:</strong> {order.customer}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
            </div>
            <div>
              <p><strong>Delivery Address:</strong></p>
              <p>{order.address}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2 pb-2 border-b">Order Items</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Quantity</th>
                <th className="py-2 text-right">Unit Price (BDT)</th>
                <th className="py-2 text-right">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">৳{item.price.toFixed(2)}</td>
                  <td className="py-2 text-right">৳{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>৳{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Delivery:</span>
                <span>৳{order.shipping.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-2">
                  <span>Discount:</span>
                  <span>-৳{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-2">
                <span>Total:</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thank you note */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-gray-600">Thank you for your order!</p>
          <p className="text-sm text-gray-500 mt-2">
            If you have any questions about this invoice, please contact us at
            support@kazikitchen.com or call +880 1234-567890
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Invoice;
