
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types/product";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["tshirts", "conjuntos", "vestidos", "cropped"];

  useEffect(() => {
    const category = searchParams.get("category");
    const section = searchParams.get("section");

    let products = mockProducts;

    if (category) {
      products = products.filter(p => p.category === category);
      setSelectedCategory(category);
    } else if (section) {
      switch (section) {
        case "lancamentos":
          products = products.filter(p => p.featured);
          break;
        case "promocoes":
          products = products.filter(p => p.isPromotion);
          break;
        case "novidades":
          products = products.filter(p => p.isNew);
          break;
      }
    }

    setFilteredProducts(products);
  }, [searchParams]);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredProducts(mockProducts.filter(p => p.category === category));
    } else {
      setFilteredProducts(mockProducts);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link to="/" className="p-2 hover:bg-accent rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold flex-1">Produtos</h1>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} />
            Filtros
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Category Filter */}
        <div className="py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => handleCategoryFilter(null)}
            >
              Todos
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap capitalize"
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
