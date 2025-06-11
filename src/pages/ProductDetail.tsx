
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { mockProducts } from "@/data/mockData";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
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

  const availableSizes = Object.entries(product.sizes)
    .filter(([_, quantity]) => quantity > 0)
    .map(([size, quantity]) => ({ size, quantity }));

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
        <div className="aspect-square bg-accent">
          <img
            src={product.image}
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
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Tamanhos Disponíveis</h3>
            <div className="grid grid-cols-5 gap-2">
              {availableSizes.map(({ size, quantity }) => (
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
            {selectedSize && (
              <p className="text-sm text-muted-foreground mt-2">
                {availableSizes.find(s => s.size === selectedSize)?.quantity} unidades disponíveis
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
            size="lg"
          >
            Adicionar ao Carrinho
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
