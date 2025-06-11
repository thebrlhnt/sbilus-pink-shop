
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { mockProducts } from "@/data/mockData";

interface ProductSectionProps {
  title: string;
  type: "lancamentos" | "promocoes" | "novidades";
}

const ProductSection = ({ title, type }: ProductSectionProps) => {
  // Filter products based on type - for demo, showing first 4 products
  const sectionProducts = mockProducts.slice(0, 4);

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
        {sectionProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
