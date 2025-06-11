
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
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
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
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-gray-100 animate-pulse rounded" />
            <div className="h-6 bg-gray-100 animate-pulse rounded w-1/2" />
            <div className="h-20 bg-gray-100 animate-pulse rounded" />
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

  // Handle sizes - show only sizes that exist for this product
  const availableSizes = product.sizes && Array.isArray(product.sizes) 
    ? product.sizes.filter(size => size && size.trim() !== '') // Filter out empty values
    : [];

  const handleAddToCart = () => {
    if (!selectedSize) {
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
      description: `${product.name} (${selectedSize}) foi adicionado ao carrinho.`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold flex-1 line-clamp-1 text-gray-900">{product.name}</h1>
          <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ShoppingCart size={20} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto">
        {/* Product Image */}
        <div className="aspect-square bg-gray-50">
          <img
            src={product.images?.[0] || product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3">
              {product.promotional_price && (
                <span className="text-lg text-gray-500 line-through">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-pink-500">
                R$ {(product.promotional_price || product.price).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || "Produto de alta qualidade da Tshirts Sbilus."}
            </p>
          </div>

          {/* Size Selection - Only show if sizes are available */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Tamanhos Disponíveis</h3>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      aspect-square border-2 rounded-lg flex items-center justify-center font-medium transition-colors
                      ${selectedSize === size 
                        ? 'border-pink-500 bg-pink-500 text-white' 
                        : 'border-gray-200 hover:border-pink-500 text-gray-700'
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
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg"
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
