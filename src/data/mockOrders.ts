
import { Order } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+8801234567890",
    deliveryAddress: "House 12, Road 5, Block A",
    deliveryLocation: "Dhanmondi",
    totalAmount: 850,
    status: "pending",
    kitchenStatus: "pending",
    riderStatus: "assigned",
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
    kitchenStatus: "completed",
    riderStatus: "delivered",
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
    kitchenStatus: "cooking",
    riderStatus: "delivering",
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
    kitchenStatus: "ready",
    riderStatus: "picked_up",
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
    kitchenStatus: "pending",
    riderStatus: "assigned",
    orderDate: "2025-01-13",
    items: [
      { name: "Dal Curry", quantity: 2, price: 200 },
      { name: "Chicken Curry", quantity: 1, price: 380 }
    ]
  }
];
