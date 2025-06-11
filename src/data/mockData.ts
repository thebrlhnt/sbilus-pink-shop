
import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "T-shirt Básica Rosa",
    description: "T-shirt básica em algodão 100%, corte feminino, ideal para o dia a dia. Confortável e versátil.",
    price: 39.90,
    originalPrice: 49.90,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "tshirts",
    sizes: { P: 5, M: 8, G: 3, GG: 2 },
    isPromotion: true,
    featured: true
  },
  {
    id: "2",
    name: "Conjunto Moletom Oversized",
    description: "Conjunto moletom oversized com calça jogger. Perfeito para dias mais frios e looks despojados.",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
    category: "conjuntos",
    sizes: { P: 3, M: 6, G: 4, GG: 1 },
    isNew: true
  },
  {
    id: "3",
    name: "Vestido Midi Floral",
    description: "Vestido midi com estampa floral delicada. Tecido fluido e corte que valoriza a silhueta.",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    category: "vestidos",
    sizes: { P: 4, M: 7, G: 5, GG: 2 },
    featured: true
  },
  {
    id: "4",
    name: "Cropped Canelado",
    description: "Top cropped em malha canelada. Modelagem justa que realça as curvas. Várias cores disponíveis.",
    price: 29.90,
    originalPrice: 39.90,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
    category: "cropped",
    sizes: { P: 6, M: 9, G: 4, GG: 1 },
    isPromotion: true
  },
  {
    id: "5",
    name: "T-shirt Estampada",
    description: "T-shirt com estampa exclusiva. Design moderno e cores vibrantes para quem gosta de se destacar.",
    price: 44.90,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
    category: "tshirts",
    sizes: { P: 5, M: 7, G: 6, GG: 3 },
    isNew: true,
    featured: true
  },
  {
    id: "6",
    name: "Conjunto Social Feminino",
    description: "Conjunto blazer e calça para looks mais formais. Tecido de qualidade e corte impecável.",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    category: "conjuntos",
    sizes: { P: 2, M: 4, G: 3, GG: 1 }
  },
  {
    id: "7",
    name: "Vestido Longo Festa",
    description: "Vestido longo elegante para ocasiões especiais. Tecido nobre e acabamento refinado.",
    price: 159.90,
    image: "https://images.unsplash.com/photo-1566479179817-c0de94e4e0bb?w=400&h=400&fit=crop",
    category: "vestidos",
    sizes: { P: 3, M: 5, G: 4, GG: 2 },
    featured: true
  },
  {
    id: "8",
    name: "Cropped Renda",
    description: "Top cropped em renda delicada. Perfeito para compor looks românticos e femininos.",
    price: 49.90,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
    category: "cropped",
    sizes: { P: 4, M: 6, G: 3, GG: 1 },
    isNew: true
  }
];
