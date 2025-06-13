
export interface SupabaseProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  promotional_price?: number;
  images?: string[];
  sizes?: string[];
  category_id?: string;
  is_new?: boolean;
  stock?: Record<string, number> | null;
  created_at: string;
  updated_at: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface SupabaseClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at: string;
}

export interface SupabaseOrder {
  id: string;
  client_id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
