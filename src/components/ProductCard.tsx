
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Get available sizes (sizes with stock > 0)
  const availableSizes = product.sizes && typeof product.sizes === 'object' 
    ? Object.entries(product.sizes as Record<string, number>)
        .filter(([_, stock]) => (stock as number) > 0)
        .map(([size]) => size)
    : [];

  // Check if product has any stock
  const hasStock = availableSizes.length > 0;
  const totalStock = Object.values(product.sizes || {}).reduce((sum, stock) => sum + (stock || 0), 0);
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

    if (!selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, selecione um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.name} (${selectedSize}) adicionado ao carrinho.`,
    });

    // Reset selection after adding to cart
    setSelectedSize("");
    setQuantity(1);
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-gray-50 relative">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!hasStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">Fora de Estoque</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors text-gray-700">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="font-semibold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        {/* Size Selection */}
        {hasStock && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setQuantity(1);
                  }}
                  className={`
                    px-2 py-1 text-xs border rounded transition-colors
                    ${selectedSize === size
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-200 hover:border-primary text-gray-600'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector - only show if size is selected */}
        {selectedSize && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">Quantidade:</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={decrementQuantity}
              >
                <Minus size={12} />
              </Button>
              <span className="text-sm font-medium w-6 text-center text-gray-700">{quantity}</span>
              <Button 
                variant="outline" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={incrementQuantity}
                disabled={quantity >= selectedSizeStock}
              >
                <Plus size={12} />
              </Button>
            </div>
          </div>
        )}

        {/* Stock info for selected size */}
        {selectedSize && (
          <div className="mb-2">
            <span className="text-xs text-gray-500">
              Estoque {selectedSize}: {selectedSizeStock} unidades
            </span>
          </div>
        )}

        <Button 
          size="sm" 
          className="w-full text-xs"
          onClick={handleAddToCart}
          disabled={!hasStock || !selectedSize}
          variant={hasStock ? "default" : "secondary"}
        >
          {!hasStock 
            ? "Fora de Estoque" 
            : !selectedSize 
            ? "Selecione um Tamanho"
            : "Adicionar ao Carrinho"
          }
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
