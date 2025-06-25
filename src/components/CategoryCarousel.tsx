
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Shirt, Package, TankTop, Sparkles } from "lucide-react";
import { fetchCategories } from "@/services/supabaseService";

const CategoryCarousel = () => {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Updated icon mapping based on your uploaded icons
  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      // T-shirts and similar
      'tshirts': Shirt,
      'camisetas': Shirt,
      'blusas': Shirt,
      
      // Tank tops and sleeveless
      'regatas': TankTop,
      'croppeds': TankTop,
      'tank-tops': TankTop,
      
      // Dresses and feminine items
      'vestidos': Sparkles,
      'dress': Sparkles,
      
      // Sets and packages
      'conjuntos': Package,
      'kits': Package,
      'sets': Package,
      
      // Default categories
      'calças': Package,
      'shorts': Package,
    };
    
    const normalizedName = categoryName.toLowerCase().trim();
    return iconMap[normalizedName] || Shirt; // Default to Shirt icon
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full animate-pulse mb-2" />
            <div className="w-12 h-4 bg-gray-100 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Error fetching categories:', error);
    return (
      <div className="text-center py-4 text-gray-500">
        Erro ao carregar categorias
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhuma categoria encontrada
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {categories.map((category) => {
        const IconComponent = getIconForCategory(category.name);
        return (
          <Link
            key={category.id}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="flex-shrink-0 text-center group"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2 hover:bg-pink-500 hover:text-white transition-colors border border-gray-200 group">
              <IconComponent size={24} className="text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <p className="text-sm font-medium capitalize text-gray-700 max-w-[64px] truncate">
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryCarousel;
