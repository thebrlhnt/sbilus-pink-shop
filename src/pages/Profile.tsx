
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/product";

const Profile = () => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [savedAddress, setSavedAddress] = useState("Rua das Flores, 123 - Centro, Fortaleza - CE");
  const [tempAddress, setTempAddress] = useState(savedAddress);

  // Mock order history
  const orderHistory: Order[] = [
    {
      id: "ORD001",
      items: [],
      total: 89.80,
      deliveryFee: 12.90,
      address: "Rua das Flores, 123",
      date: "2024-06-10",
      status: "completed"
    },
    {
      id: "ORD002",
      items: [],
      total: 129.90,
      deliveryFee: 12.90,
      address: "Rua das Flores, 123",
      date: "2024-06-08",
      status: "pending"
    }
  ];

  const handleSaveAddress = () => {
    setSavedAddress(tempAddress);
    setIsEditingAddress(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Link to="/" className="p-2 hover:bg-accent rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold flex-1">Meu Perfil</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        {/* User Info */}
        <div className="py-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl text-primary-foreground">👤</span>
            </div>
            <h2 className="text-xl font-semibold">Cliente Tshirts Sbilus</h2>
          </div>
        </div>

        {/* Saved Address */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin size={20} />
              Endereço Salvo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingAddress ? (
              <div className="space-y-3">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="Digite seu endereço completo"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveAddress} size="sm">
                    Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsEditingAddress(false);
                      setTempAddress(savedAddress);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <p className="text-muted-foreground flex-1">{savedAddress}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingAddress(true)}
                  className="ml-2"
                >
                  <Edit size={14} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={20} />
              Histórico de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum pedido encontrado
              </p>
            ) : (
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">#{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Data: {new Date(order.date).toLocaleDateString('pt-BR')}</p>
                      <p>Total: R$ {order.total.toFixed(2)}</p>
                      <p className="line-clamp-1">Endereço: {order.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="py-6">
          <Link to="/products">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Profile;
