
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProduct, SupabaseCategory } from "@/types/supabase";
import { Product } from "@/types/product";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name
      )
    `);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (products || []).map(transformSupabaseProduct);
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return product ? transformSupabaseProduct(product) : null;
};

export const fetchCategories = async (): Promise<SupabaseCategory[]> => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
};

export const fetchProductsByCategory = async (categoryName: string): Promise<Product[]> => {
  // First get the category ID
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .maybeSingle();

  if (categoryError || !category) {
    console.error('Error fetching category:', categoryError);
    return [];
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('category_id', category.id);

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return (products || []).map(transformSupabaseProduct);
};

export const updateProductStock = async (
  productId: string,
  size: string,
  quantity: number,
  movementType: 'in' | 'out' | 'adjustment',
  reason?: string
): Promise<boolean> => {
  const { data, error } = await supabase.rpc('update_product_stock', {
    p_product_id: productId,
    p_size: size,
    p_quantity: quantity,
    p_movement_type: movementType,
    p_reason: reason
  });

  if (error) {
    console.error('Error updating stock:', error);
    throw error;
  }

  return data;
};

const transformSupabaseProduct = (supabaseProduct: any): Product => {
  // Handle stock data from the database
  let sizesObj: Product['sizes'] = {};
  
  if (supabaseProduct.stock && typeof supabaseProduct.stock === 'object') {
    // Use stock data from database
    const stockData = supabaseProduct.stock as Record<string, number>;
    Object.keys(stockData).forEach(size => {
      sizesObj[size as keyof Product['sizes']] = stockData[size];
    });
  } else {
    // Fallback to default sizes if no stock data
    sizesObj.U = 0;
    sizesObj.P = 0;
    sizesObj.M = 0;
    sizesObj.G = 0;
    sizesObj.GG = 0;
  }

  // Get category name from the joined data
  const categoryName = supabaseProduct.categories?.name || "tshirts";

  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description || '',
    price: supabaseProduct.price,
    originalPrice: supabaseProduct.promotional_price ? supabaseProduct.price : undefined,
    image: supabaseProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: categoryName,
    sizes: sizesObj,
    featured: false,
    isPromotion: !!supabaseProduct.promotional_price,
    isNew: !!supabaseProduct.is_new
  };
};
