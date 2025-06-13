
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Shirt, Zap, Sparkles, ShoppingBag, Package } from "lucide-react";
import { fetchCategories } from "@/services/supabaseService";

const CategoryCarousel = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Unique icon mapping with Lucide React icons
  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'tshirts': Shirt,
      'vestidos': Sparkles,
      'conjuntos': Package,
      'regatas': Zap,
      'kits': ShoppingBag,
      'camisetas': Shirt,
      'blusas': Sparkles,
      'calças': Package,
      'shorts': Zap,
    };
    
    const normalizedName = categoryName.toLowerCase();
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

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {categories.map((category) => {
        const IconComponent = getIconForCategory(category.name);
        return (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="flex-shrink-0 text-center"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2 hover:bg-pink-500 hover:text-white transition-colors border border-gray-200">
              <IconComponent size={24} className="text-gray-600 group-hover:text-white" />
            </div>
            <p className="text-sm font-medium capitalize text-gray-700">{category.name}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryCarousel;
