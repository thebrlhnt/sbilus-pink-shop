
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

  // Safely handle sizes - assume it's an object with size:quantity pairs or an array
  const availableSizes = product.sizes && typeof product.sizes === 'object' 
    ? Array.isArray(product.sizes)
      ? product.sizes.filter(size => size) // If it's an array, filter out empty values
      : Object.entries(product.sizes as Record<string, number>)
          .filter(([_, quantity]) => (quantity as number) > 0)
          .map(([size]) => size)
    : [];

  const handleAddToCart = () => {
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
        <div className="aspect-square bg-muted">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
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

        <div className="flex flex-wrap gap-1 mb-3">
          {availableSizes.slice(0, 3).map((size, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {size}
            </Badge>
          ))}
          {availableSizes.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{availableSizes.length - 3}
            </Badge>
          )}
        </div>

        {/* Quantity Selector */}
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

        <Button 
          size="sm" 
          className="w-full text-xs"
          onClick={handleAddToCart}
        >
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
