
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { fetchProductById } from "@/services/supabaseService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? fetchProductById(id) : Promise.resolve(null),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3">
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
          <div className="aspect-square bg-gray-50 animate-pulse" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-gray-50 animate-pulse rounded" />
            <div className="h-6 bg-gray-50 animate-pulse rounded w-1/2" />
            <div className="h-20 bg-gray-50 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Produto não encontrado</p>
          <Link to="/products">
            <Button>Voltar aos Produtos</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get available sizes with stock > 0
  const availableSizes = product.sizes && typeof product.sizes === 'object'
    ? Object.entries(product.sizes as Record<string, number>)
        .filter(([_, stock]) => (stock as number) > 0)
        .map(([size]) => size)
    : [];

  const hasStock = availableSizes.length > 0;
  const selectedSizeStock = selectedSize ? product.sizes?.[selectedSize as keyof typeof product.sizes] || 0 : 0;

  const handleAddToCart = () => {
    if (!hasStock) {
      toast({
        title: "Produto indisponível",
        description: "Este produto está fora de estoque.",
        variant: "destructive",
      });
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, selecione um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSizeStock === 0) {
      toast({
        title: "Tamanho indisponível",
        description: "Este tamanho está fora de estoque.",
        variant: "destructive",
      });
      return;
    }

    // Add to cart logic would go here
    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.name}${selectedSize ? ` (${selectedSize})` : ''} foi adicionado ao carrinho.`,
    });
  };

  const incrementQuantity = () => {
    if (quantity < selectedSizeStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3">
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
          <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ShoppingCart size={20} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto">
        {/* Product Image */}
        <div className="aspect-square bg-gray-50 relative">
          <img
            src={product.images?.[0] || product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!hasStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Fora de Estoque</span>
            </div>
          )}
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
                {Object.keys(product.sizes || {}).map((size) => {
                  const stock = product.sizes?.[size as keyof typeof product.sizes] || 0;
                  const isAvailable = stock > 0;
                  const isSelected = selectedSize === size;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedSize(size);
                          setQuantity(1);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`
                        aspect-square border-2 rounded-lg flex items-center justify-center font-medium transition-colors relative
                        ${isSelected && isAvailable
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : isAvailable
                          ? 'border-border hover:border-primary'
                          : 'border-border bg-gray-50 text-muted-foreground cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <span className="text-sm">{size}</span>
                      <span className="absolute -bottom-5 text-xs text-muted-foreground">
                        {stock}
                      </span>
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <p className="text-sm text-muted-foreground mt-4">
                  Estoque do tamanho {selectedSize}: {selectedSizeStock} unidades
                </p>
              )}
            </div>
          )}

          {/* Quantity Selection - Only show if size is selected */}
          {selectedSize && selectedSizeStock > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Quantidade</h3>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="text-xl font-medium min-w-[3rem] text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={incrementQuantity}
                  disabled={quantity >= selectedSizeStock}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Stock status */}
          {!hasStock && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-600 mb-2">Produto Indisponível</h3>
              <p className="text-sm text-muted-foreground">
                Este produto está temporariamente fora de estoque. Entre em contato conosco para verificar a previsão de reposição.
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className="w-full py-6 text-lg"
            size="lg"
            disabled={!hasStock || (availableSizes.length > 0 && !selectedSize) || selectedSizeStock === 0}
            variant={hasStock ? "default" : "secondary"}
          >
            {!hasStock 
              ? "Fora de Estoque" 
              : availableSizes.length > 0 && !selectedSize
              ? "Selecione um Tamanho"
              : selectedSizeStock === 0
              ? "Tamanho Indisponível"
              : "Adicionar ao Carrinho"
            }
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
