
import { Link } from "react-router-dom";

const categories = [
  { name: "Tshirts", icon: "👕", path: "/products?category=tshirts" },
  { name: "Conjuntos", icon: "👗", path: "/products?category=conjuntos" },
  { name: "Vestidos", icon: "👚", path: "/products?category=vestidos" },
  { name: "Cropped", icon: "🎽", path: "/products?category=cropped" },
];

const CategoryCarousel = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Link
          key={category.name}
          to={category.path}
          className="flex-shrink-0 text-center"
        >
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-2 hover:bg-primary hover:text-primary-foreground transition-colors">
            <span className="text-2xl">{category.icon}</span>
          </div>
          <p className="text-sm font-medium">{category.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryCarousel;
