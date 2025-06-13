
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "tshirts" | "conjuntos" | "vestidos" | "cropped";
  sizes: {
    U?: number;
    P?: number;
    M?: number;
    G?: number;
    GG?: number;
  };
  featured?: boolean;
  isPromotion?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  address: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
}

export interface StockMovement {
  id: string;
  productId: string;
  size: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdAt: string;
}
