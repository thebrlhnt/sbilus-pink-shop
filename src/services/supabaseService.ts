
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProduct, SupabaseCategory } from "@/types/supabase";
import { Product } from "@/types/product";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (products || []).map(transformSupabaseProduct);
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
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
    .select('*');

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
    .select('*')
    .eq('category_id', category.id);

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return (products || []).map(transformSupabaseProduct);
};

const transformSupabaseProduct = (supabaseProduct: SupabaseProduct): Product => {
  // Create sizes object with default quantities
  const sizesObj: Product['sizes'] = {};
  if (supabaseProduct.sizes) {
    supabaseProduct.sizes.forEach(size => {
      sizesObj[size as keyof Product['sizes']] = 5; // Default quantity
    });
  } else {
    // Default sizes if none specified
    sizesObj.U = 5;
    sizesObj.P = 5;
    sizesObj.M = 5;
    sizesObj.G = 5;
    sizesObj.GG = 5;
  }

  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description || '',
    price: supabaseProduct.price,
    originalPrice: supabaseProduct.promotional_price ? supabaseProduct.price : undefined,
    image: supabaseProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "tshirts", // Default category, you might want to map this properly
    sizes: sizesObj,
    featured: false,
    isPromotion: !!supabaseProduct.promotional_price,
    isNew: !!supabaseProduct.is_new
  };
};
