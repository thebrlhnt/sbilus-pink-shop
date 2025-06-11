
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductSection from "@/components/ProductSection";

const Index = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-primary">Tshirts Sbilus</h1>
          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/5585988439111" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-primary hover:bg-accent rounded-full transition-colors"
            >
              <MessageCircle size={24} />
            </a>
            <Link to="/cart" className="relative p-2 text-primary hover:bg-accent rounded-full transition-colors">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="p-2 text-primary hover:bg-accent rounded-full transition-colors">
              <User size={24} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Categories */}
        <section className="py-6">
          <h2 className="text-xl font-semibold mb-4">Categorias</h2>
          <CategoryCarousel />
        </section>

        {/* Featured Sections */}
        <ProductSection title="Lançamentos" type="lancamentos" />
        <ProductSection title="Promoções" type="promocoes" />
        <ProductSection title="Novidades" type="novidades" />

        {/* Ver Tudo Button */}
        <div className="py-6">
          <Link to="/products">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Ver Todos os Produtos
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
