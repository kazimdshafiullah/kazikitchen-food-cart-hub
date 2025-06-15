
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  is_frozen_food?: boolean;
}
