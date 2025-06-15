
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
