
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { fetchProductById } from "@/services/supabaseService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? fetchProductById(id) : Promise.resolve(null),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-semibold flex-1">Carregando...</h1>
          </div>
        </header>
        <div className="max-w-md mx-auto">
          <div className="aspect-square bg-muted animate-pulse" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Produto não encontrado</p>
          <Link to="/products">
            <Button>Voltar aos Produtos</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle sizes - get available sizes from the product
  const availableSizes = product.sizes && Array.isArray(product.sizes) 
    ? product.sizes.filter(size => size && size.trim() !== '') 
    : Object.keys(product.sizes || {}).filter(size => (product.sizes as any)[size] > 0);

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, selecione um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    // Add to cart logic would go here
    toast({
      title: "Produto adicionado!",
      description: `${product.name}${selectedSize ? ` (${selectedSize})` : ''} foi adicionado ao carrinho.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold flex-1 line-clamp-1">{product.name}</h1>
          <Link to="/cart" className="p-2 hover:bg-accent rounded-full transition-colors">
            <ShoppingCart size={20} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto">
        {/* Product Image */}
        <div className="aspect-square bg-muted">
          <img
            src={product.images?.[0] || product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "Produto de alta qualidade da Tshirts Sbilus."}
            </p>
          </div>

          {/* Size Selection - Only show if sizes are available */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Tamanhos Disponíveis</h3>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      aspect-square border-2 rounded-lg flex items-center justify-center font-medium transition-colors
                      ${selectedSize === size 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-border hover:border-primary'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className="w-full py-6 text-lg"
            size="lg"
            disabled={availableSizes.length > 0 && !selectedSize}
          >
            Adicionar ao Carrinho
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
