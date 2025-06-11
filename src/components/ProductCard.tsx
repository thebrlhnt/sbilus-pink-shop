
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Safely handle sizes - assume it's an object with size:quantity pairs or an array
  const availableSizes = product.sizes && typeof product.sizes === 'object' 
    ? Array.isArray(product.sizes)
      ? product.sizes.filter(size => size) // If it's an array, filter out empty values
      : Object.entries(product.sizes as Record<string, number>)
          .filter(([_, quantity]) => (quantity as number) > 0)
          .map(([size]) => size)
    : [];

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-accent">
          <img
            src={product.image || product.images?.[0] || '/placeholder.svg'}
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

        <Button 
          size="sm" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
        >
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
