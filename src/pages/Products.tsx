
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, fetchCategories, fetchProductsByCategory } from "@/services/supabaseService";
import { Product } from "@/types/product";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: categoryProducts = [], isLoading: categoryLoading } = useQuery({
    queryKey: ['products', 'category', selectedCategory],
    queryFn: () => selectedCategory ? fetchProductsByCategory(selectedCategory) : Promise.resolve([]),
    enabled: !!selectedCategory,
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const category = searchParams.get("category");
    const section = searchParams.get("section");

    if (category) {
      setSelectedCategory(category);
    } else {
      let products = allProducts;

      if (section) {
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
      setSelectedCategory(null);
    }
  }, [searchParams, allProducts]);

  useEffect(() => {
    if (selectedCategory && categoryProducts.length >= 0) {
      setFilteredProducts(categoryProducts);
    }
  }, [selectedCategory, categoryProducts]);

  const handleCategoryFilter = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    
    // Update URL params
    if (categoryName) {
      setSearchParams({ category: categoryName });
    } else {
      setSearchParams({});
      setFilteredProducts(allProducts);
    }
  };

  const isLoading = productsLoading || categoriesLoading || (selectedCategory && categoryLoading);

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
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap capitalize"
                onClick={() => handleCategoryFilter(category.name)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
