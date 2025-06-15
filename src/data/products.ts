
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  featured?: boolean;
  popular?: boolean;
  is_frozen_food?: boolean;
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

// Remove all mock products - the app will now use real data from Supabase
export const products: Product[] = [];

// Update helper functions to work with the new database structure
export const getProductsByCategory = (categoryId: string): Product[] => {
  // This will be replaced by database queries in the frontend components
  return [];
};

export const getProductById = (id: string): Product | undefined => {
  // This will be replaced by database queries in the frontend components
  return undefined;
};

export const getFeaturedProducts = (): Product[] => {
  // This will be replaced by database queries for featured menu items
  return [];
};

export const getPopularProducts = (): Product[] => {
  // This will be replaced by database queries for popular menu items
  return [];
};

export const searchProducts = (query: string): Product[] => {
  // This will be replaced by database queries with search functionality
  return [];
};
