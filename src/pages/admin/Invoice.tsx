
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Comprehensive mock orders for demonstration - matching Orders.tsx data
const getOrderDetails = (orderId: string) => {
  console.log("Fetching order details for ID:", orderId);
  
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
      source: "website"
    },
    { 
      id: "ORD-1003", 
      customer: "Mike Chen", 
      email: "mike@example.com",
      phone: "+8801111111111",
      address: "789 Uttara, Dhaka, Bangladesh",
      date: "2025-05-19", 
      items: [
        { name: "Fish Curry", quantity: 1, price: 450.00 },
        { name: "Rice", quantity: 2, price: 71.875 }
      ],
      shipping: 125.00,
      discount: 50,
      total: 593.75, 
      status: "delivered",
      paymentMethod: "bKash",
      source: "meta"
    },
    { 
      id: "ORD-1004", 
      customer: "Emily Wong", 
      email: "emily@example.com",
      phone: "+8802222222222",
      address: "321 Banani, Dhaka, Bangladesh",
      date: "2025-05-19", 
      items: [
        { name: "Beef Curry", quantity: 2, price: 550.00 },
        { name: "Basmati Rice", quantity: 3, price: 120.00 },
        { name: "Naan Bread", quantity: 4, price: 80.00 }
      ],
      shipping: 125.00,
      discount: 0,
      total: 3100.00, 
      status: "shipped",
      paymentMethod: "SSL Commerz",
      source: "website"
    },
    { 
      id: "ORD-1005", 
      customer: "Alex Johnson", 
      email: "alex@example.com",
      phone: "+8803333333333",
      address: "654 Mirpur, Dhaka, Bangladesh",
      date: "2025-05-18", 
      items: [
        { name: "Chicken Tikka", quantity: 2, price: 400.00 },
        { name: "Dal Curry", quantity: 1, price: 180.00 },
        { name: "Roti", quantity: 6, price: 50.00 }
      ],
      shipping: 125.00,
      discount: 75,
      total: 1681.25, 
      status: "processing",
      paymentMethod: "bKash",
      source: "meta"
    },
    { 
      id: "ORD-1006", 
      customer: "Lisa Garcia", 
      email: "lisa@example.com",
      phone: "+8804444444444",
      address: "987 Wari, Dhaka, Bangladesh",
      date: "2025-05-18", 
      items: [
        { name: "Mutton Biryani", quantity: 1, price: 650.00 },
        { name: "Raita", quantity: 2, price: 80.00 },
        { name: "Dessert", quantity: 1, price: 200.00 }
      ],
      shipping: 125.00,
      discount: 0,
      total: 2462.50, 
      status: "cancelled",
      paymentMethod: "Cash on Delivery",
      source: "website"
    },
    { 
      id: "ORD-1007", 
      customer: "David Kim", 
      email: "david@example.com",
      phone: "+8805555555555",
      address: "147 Mohammadpur, Dhaka, Bangladesh",
      date: "2025-05-17", 
      items: [
        { name: "Prawn Curry", quantity: 1, price: 480.00 },
        { name: "Fried Rice", quantity: 1, price: 250.00 },
        { name: "Soft Drink", quantity: 2, price: 60.00 }
      ],
      shipping: 125.00,
      discount: 40.25,
      total: 874.75, 
      status: "delivered",
      paymentMethod: "bKash",
      source: "website"
    },
    { 
      id: "ORD-1008", 
      customer: "Rachel Green", 
      email: "rachel@example.com",
      phone: "+8806666666666",
      address: "852 Tejgaon, Dhaka, Bangladesh",
      date: "2025-05-16", 
      items: [
        { name: "Vegetable Biryani", quantity: 2, price: 320.00 },
        { name: "Chicken Soup", quantity: 1, price: 150.00 },
        { name: "Salad", quantity: 1, price: 120.00 }
      ],
      shipping: 125.00,
      discount: 0,
      total: 1381.25, 
      status: "shipped",
      paymentMethod: "SSL Commerz",
      source: "meta"
    },
    { 
      id: "ORD-1009", 
      customer: "Taylor Swift", 
      email: "taylor@example.com",
      phone: "+8807777777777",
      address: "963 Ramna, Dhaka, Bangladesh",
      date: "2025-05-21", 
      items: [
        { name: "Fish Biryani", quantity: 1, price: 380.00 },
        { name: "Mixed Vegetables", quantity: 2, price: 140.00 },
        { name: "Lassi", quantity: 2, price: 100.00 }
      ],
      shipping: 125.00,
      discount: 0,
      total: 1068.75, 
      status: "pending",
      paymentMethod: "Cash on Delivery",
      source: "website"
    },
    { 
      id: "ORD-1010", 
      customer: "James Wilson", 
      email: "james@example.com",
      phone: "+8808888888888",
      address: "741 Kalabagan, Dhaka, Bangladesh",
      date: "2025-05-21", 
      items: [
        { name: "Lamb Curry", quantity: 1, price: 750.00 },
        { name: "Pilaf Rice", quantity: 2, price: 180.00 },
        { name: "Yogurt", quantity: 1, price: 80.00 }
      ],
      shipping: 125.00,
      discount: 0,
      total: 1695.00, 
      status: "pending",
      paymentMethod: "bKash",
      source: "meta"
    },
  ];
  
  // Try to find exact match first
  let order = mockOrders.find(order => order.id === orderId);
  
  // If not found, try to find by partial match (in case of different formatting)
  if (!order) {
    order = mockOrders.find(order => order.id.includes(orderId) || orderId.includes(order.id));
  }
  
  console.log("Found order:", order);
  return order || null;
};

const Invoice = () => {
  const { id, orderId } = useParams<{ id?: string; orderId?: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Use either id or orderId parameter
    const paramId = id || orderId;
    console.log("Invoice component mounted with ID:", paramId);
    console.log("URL params - id:", id, "orderId:", orderId);
    
    if (paramId) {
      try {
        const orderData = getOrderDetails(paramId);
        console.log("Found order data:", orderData);
        
        if (orderData) {
          setOrder(orderData);
          setError("");
        } else {
          setError(`No order found with ID: ${paramId}`);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Error loading order details");
      }
      setLoading(false);
    } else {
      console.log("No ID parameter provided");
      setError("No order ID provided");
      setLoading(false);
    }
  }, [id, orderId]);

  if (loading) return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading invoice...</div>
    </div>
  );
  
  if (error || !order) return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
        <p className="text-gray-600">{error || `Order ID: ${id || orderId}`}</p>
        <p className="text-sm text-gray-500 mt-2">
          Available orders: ORD-1001, ORD-1002, ORD-1003, ORD-1004, ORD-1005, ORD-1006, ORD-1007, ORD-1008, ORD-1009, ORD-1010
        </p>
      </div>
    </div>
  );

  const handlePrint = () => {
    console.log("Print button clicked");
    window.print();
  };

  const handleDownload = () => {
    console.log("Download button clicked");
    toast({
      title: "Success",
      description: "PDF download functionality would be implemented here",
    });
  };

  const calculateSubtotal = () => {
    return order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Invoice #{order.id}</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handlePrint} variant="outline" className="flex-1 sm:flex-none">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="p-4 md:p-8 mb-6 bg-white">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-kazi-red">KAZI KITCHEN</h1>
            <p className="text-gray-500 text-sm md:text-base">123 Culinary Lane</p>
            <p className="text-gray-500 text-sm md:text-base">Dhaka, Bangladesh</p>
            <p className="text-gray-500 text-sm md:text-base">Phone: +880 1234-567890</p>
            <p className="text-gray-500 text-sm md:text-base">Email: info@kazikitchen.com</p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <h2 className="text-lg md:text-xl font-bold">INVOICE</h2>
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
          <h3 className="text-base md:text-lg font-bold mb-2 pb-2 border-b">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm md:text-base"><strong>Name:</strong> {order.customer}</p>
              <p className="text-sm md:text-base"><strong>Email:</strong> {order.email}</p>
              <p className="text-sm md:text-base"><strong>Phone:</strong> {order.phone}</p>
            </div>
            <div>
              <p className="text-sm md:text-base"><strong>Delivery Address:</strong></p>
              <p className="text-sm md:text-base">{order.address}</p>
              <p className="text-sm md:text-base"><strong>Payment Method:</strong> {order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-base md:text-lg font-bold mb-2 pb-2 border-b">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price (BDT)</th>
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
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between py-2 text-sm md:text-base">
                <span>Subtotal:</span>
                <span>৳{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm md:text-base">
                <span>Delivery:</span>
                <span>৳{order.shipping.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-2 text-sm md:text-base">
                  <span>Discount:</span>
                  <span>-৳{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-2 text-sm md:text-base">
                <span>Total:</span>
                <span>৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thank you note */}
        <div className="text-center mt-8 md:mt-12 pt-8 border-t">
          <p className="text-gray-600 text-sm md:text-base">Thank you for your order!</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            If you have any questions about this invoice, please contact us at
            support@kazikitchen.com or call +880 1234-567890
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Invoice;
