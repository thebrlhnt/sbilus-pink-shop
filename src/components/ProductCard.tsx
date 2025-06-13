
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

  const handleAddToCart = () => {
    if (!hasStock) {
      toast({
        title: "Produto indisponível",
        description: "Este produto está fora de estoque.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.name} adicionado ao carrinho.`,
    });
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-muted relative">
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
          <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="font-semibold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {availableSizes.slice(0, 3).map((size, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {size} ({product.sizes?.[size as keyof typeof product.sizes]})
            </Badge>
          ))}
          {availableSizes.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{availableSizes.length - 3}
            </Badge>
          )}
        </div>

        {/* Stock indicator */}
        <div className="mb-2">
          <span className="text-xs text-muted-foreground">
            Estoque total: {totalStock} unidades
          </span>
        </div>

        {/* Quantity Selector - only show if has stock */}
        {hasStock && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Quantidade:</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={decrementQuantity}
              >
                <Minus size={12} />
              </Button>
              <span className="text-sm font-medium w-6 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={incrementQuantity}
              >
                <Plus size={12} />
              </Button>
            </div>
          </div>
        )}

        <Button 
          size="sm" 
          className="w-full text-xs"
          onClick={handleAddToCart}
          disabled={!hasStock}
          variant={hasStock ? "default" : "secondary"}
        >
          {hasStock ? "Adicionar ao Carrinho" : "Fora de Estoque"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
