
import { Order } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com", 
    customerPhone: "+8801234567890",
    deliveryAddress: "123 Main St, Dhanmondi, Dhaka",
    deliveryLocation: "Dhanmondi",
    totalAmount: 850,
    status: "pending",
    kitchenStatus: "pending", 
    riderStatus: "not_assigned",
    orderDate: "2024-01-15",
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 400 },
      { name: "Beef Curry", quantity: 1, price: 350 },
      { name: "Rice", quantity: 1, price: 100 }
    ]
  },
  {
    id: "ORD-002", 
    customerName: "Sarah Ahmed",
    customerEmail: "sarah.ahmed@example.com",
    customerPhone: "+8801234567891", 
    deliveryAddress: "456 Ring Road, Farmgate, Dhaka",
    deliveryLocation: "Farmgate",
    totalAmount: 1200,
    status: "confirmed",
    kitchenStatus: "cooking",
    riderStatus: "not_assigned", 
    orderDate: "2024-01-15",
    items: [
      { name: "Fish Curry", quantity: 1, price: 450 },
      { name: "Mutton Biryani", quantity: 1, price: 550 },
      { name: "Salad", quantity: 2, price: 100 }
    ]
  },
  {
    id: "ORD-003",
    customerName: "Mike Rahman", 
    customerEmail: "mike.rahman@example.com",
    customerPhone: "+8801234567892",
    deliveryAddress: "789 Green Road, Panthapath, Dhaka", 
    deliveryLocation: "Panthapath",
    totalAmount: 650,
    status: "processing",
    kitchenStatus: "ready",
    riderStatus: "assigned",
    orderDate: "2024-01-14", 
    items: [
      { name: "Vegetable Curry", quantity: 2, price: 250 },
      { name: "Chicken Fry", quantity: 1, price: 300 },
      { name: "Rice", quantity: 1, price: 100 }
    ]
  },
  {
    id: "ORD-004",
    customerName: "Lisa Khan",
    customerEmail: "lisa.khan@example.com",
    customerPhone: "+8801234567893",
    deliveryAddress: "321 University Road, Karwanbazar, Dhaka",
    deliveryLocation: "Karwanbazar", 
    totalAmount: 950,
    status: "out-for-delivery",
    kitchenStatus: "completed",
    riderStatus: "delivering",
    orderDate: "2024-01-14",
    items: [
      { name: "Prawn Curry", quantity: 1, price: 500 },
      { name: "Chicken Biryani", quantity: 1, price: 400 },
      { name: "Drinks", quantity: 1, price: 50 }
    ]
  },
  {
    id: "ORD-005", 
    customerName: "David Islam",
    customerEmail: "david.islam@example.com",
    customerPhone: "+8801234567894",
    deliveryAddress: "654 Elephant Road, New Market, Dhaka",
    deliveryLocation: "New Market",
    totalAmount: 750,
    status: "delivered", 
    kitchenStatus: "completed",
    riderStatus: "delivered",
    orderDate: "2024-01-13",
    items: [
      { name: "Beef Biryani", quantity: 1, price: 450 },
      { name: "Chicken Curry", quantity: 1, price: 250 },
      { name: "Rice", quantity: 1, price: 50 }
    ]
  }
];
