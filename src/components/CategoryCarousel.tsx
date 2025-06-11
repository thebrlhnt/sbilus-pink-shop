
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/supabaseService";

const CategoryCarousel = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Default icon mapping - you can customize this
  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'tshirts': '👕',
      'conjuntos': '👗',
      'vestidos': '👚',
      'cropped': '🎽',
      'camisetas': '👕',
      'blusas': '👚',
      'calças': '👖',
      'shorts': '🩳',
    };
    
    const normalizedName = categoryName.toLowerCase();
    return iconMap[normalizedName] || '👕'; // Default to t-shirt icon
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 text-center">
            <div className="w-16 h-16 bg-muted rounded-full animate-pulse mb-2" />
            <div className="w-12 h-4 bg-muted rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/products?category=${category.name}`}
          className="flex-shrink-0 text-center"
        >
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-2 hover:bg-primary hover:text-primary-foreground transition-colors">
            <span className="text-2xl">{getIconForCategory(category.name)}</span>
          </div>
          <p className="text-sm font-medium capitalize">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryCarousel;
