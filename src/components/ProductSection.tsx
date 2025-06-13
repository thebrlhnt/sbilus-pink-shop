
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { fetchProducts } from "@/services/supabaseService";

interface ProductSectionProps {
  title: string;
  type: "lancamentos" | "promocoes";
}

const ProductSection = ({ title, type }: ProductSectionProps) => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', type],
    queryFn: fetchProducts,
  });

  const filteredProducts = products.filter(product => {
    switch (type) {
      case "lancamentos":
        return product.featured || product.isNew; // Include both featured and new products
      case "promocoes":
        return product.isPromotion;
      default:
        return true;
    }
  }).slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white animate-pulse rounded-lg h-64 border border-gray-200" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error in ProductSection:', error);
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link 
          to={`/products?section=${type}`}
          className="text-primary text-sm hover:underline"
        >
          Ver mais
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum produto encontrado para {title.toLowerCase()}
        </div>
      )}
    </section>
  );
};

export default ProductSection;
