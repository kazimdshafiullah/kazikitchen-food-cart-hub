
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryLocation: string;
  totalAmount: number;
  status: string;
  kitchenStatus: string;
  riderStatus: string;
  orderDate: string;
  items: OrderItem[];
}

export const deliveryLocations = [
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

export const orderStatuses = [
  "All Status",
  "pending",
  "confirmed", 
  "processing",
  "out-for-delivery",
  "delivered",
  "cancelled"
];
