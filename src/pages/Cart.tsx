
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/product";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  const subtotal = cartItems.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  );

  const total = subtotal + deliveryFee;

  const calculateDelivery = () => {
    if (address.trim()) {
      // Simulated delivery calculation
      setDeliveryFee(12.90);
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `
🛍️ *Pedido - Tshirts Sbilus*

📋 *Produtos:*
${cartItems.map(item => 
  `• ${item.product.name}\n  Tamanho: ${item.size}\n  Quantidade: ${item.quantity}\n  Valor: R$ ${(item.product.price * item.quantity).toFixed(2)}`
).join('\n\n')}

💰 *Resumo:*
Subtotal: R$ ${subtotal.toFixed(2)}
Taxa de entrega: R$ ${deliveryFee.toFixed(2)}
*Total: R$ ${total.toFixed(2)}*

📍 *Endereço:*
${address}

Obrigado pela preferência! 💕
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5585988439111?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link to="/" className="p-2 hover:bg-accent rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold flex-1">Carrinho</h1>
          <span className="text-sm text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
            <Link to="/products">
              <Button>Continuar Comprando</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="py-4 space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">Tamanho: {item.size}</p>
                      <p className="font-semibold text-primary">R$ {item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="outline" size="sm" className="p-1">
                        <Trash2 size={14} />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <Minus size={12} />
                        </Button>
                        <span className="text-sm px-2">{item.quantity}</span>
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Input */}
            <div className="py-4">
              <Label htmlFor="address" className="text-base font-semibold">
                Endereço de Entrega
              </Label>
              <div className="mt-2 space-y-2">
                <Input
                  id="address"
                  placeholder="Digite seu endereço completo"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button 
                  onClick={calculateDelivery}
                  variant="outline" 
                  size="sm"
                  disabled={!address.trim()}
                >
                  Calcular Entrega
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Resumo do Pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="py-6">
              <Button
                onClick={generateWhatsAppMessage}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                size="lg"
                disabled={cartItems.length === 0 || !address.trim()}
              >
                Finalizar Pedido via WhatsApp
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
