
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  featured?: boolean;
  popular?: boolean;
};

export const categories = [
  {
    id: "frozen-food",
    name: "Frozen Food",
    image: "/placeholder.svg"
  },
  {
    id: "breakfast",
    name: "Breakfast",
    image: "/placeholder.svg"
  },
  {
    id: "children-tiffin",
    name: "Children's Tiffin",
    image: "/placeholder.svg"
  },
  {
    id: "lunch",
    name: "Lunch",
    image: "/placeholder.svg"
  },
  {
    id: "dinner",
    name: "Dinner",
    image: "/placeholder.svg"
  },
  {
    id: "desserts",
    name: "Desserts",
    image: "/placeholder.svg"
  }
];

export const products: Product[] = [
  {
    id: "1",
    name: "Chicken Biryani",
    price: 12.99,
    image: "/placeholder.svg",
    category: "frozen-food",
    description: "Authentic chicken biryani with aromatic spices and basmati rice.",
    featured: true,
    popular: true
  },
  {
    id: "2",
    name: "Breakfast Platter",
    price: 9.99,
    image: "/placeholder.svg",
    category: "breakfast",
    description: "Delicious breakfast platter with eggs, toast, and fresh fruits.",
    featured: true
  },
  {
    id: "3",
    name: "Kids Lunch Box",
    price: 7.99,
    image: "/placeholder.svg",
    category: "children-tiffin",
    description: "Nutritious and fun lunch box specially designed for children.",
    popular: true
  },
  {
    id: "4",
    name: "Vegetable Curry",
    price: 8.99,
    image: "/placeholder.svg",
    category: "lunch",
    description: "Healthy vegetable curry with a blend of authentic spices."
  },
  {
    id: "5",
    name: "Beef Steak",
    price: 15.99,
    image: "/placeholder.svg",
    category: "dinner",
    description: "Juicy beef steak served with mashed potatoes and vegetables."
  },
  {
    id: "6",
    name: "Chocolate Cake",
    price: 5.99,
    image: "/placeholder.svg",
    category: "desserts",
    description: "Decadent chocolate cake with rich frosting.",
    popular: true
  },
  {
    id: "7",
    name: "Paratha Wrap",
    price: 6.99,
    image: "/placeholder.svg",
    category: "breakfast",
    description: "Flaky paratha wrapped with eggs and vegetables."
  },
  {
    id: "8",
    name: "Grilled Chicken",
    price: 11.99,
    image: "/placeholder.svg",
    category: "lunch",
    description: "Tender grilled chicken with special marinade and herbs."
  },
  {
    id: "9",
    name: "Fish Curry",
    price: 13.99,
    image: "/placeholder.svg",
    category: "dinner",
    description: "Flavorful fish curry cooked with traditional spices."
  },
  {
    id: "10",
    name: "Mixed Vegetables",
    price: 7.99,
    image: "/placeholder.svg",
    category: "frozen-food",
    description: "Assorted vegetables flash frozen to preserve nutrients."
  },
  {
    id: "11",
    name: "Fruit Pudding",
    price: 4.99,
    image: "/placeholder.svg",
    category: "desserts",
    description: "Creamy pudding topped with seasonal fruits."
  },
  {
    id: "12",
    name: "Kid's Pasta",
    price: 6.99,
    image: "/placeholder.svg",
    category: "children-tiffin",
    description: "Colorful pasta shapes in a mild cheese sauce, perfect for kids."
  }
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getPopularProducts = (): Product[] => {
  return products.filter(product => product.popular);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};
