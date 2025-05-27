
import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
}

const CategoryCard = ({ id, name, image }: CategoryCardProps) => {
  return (
    <Link to={`/?category=${id}`} className="category-card block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-3 md:p-4 text-center">
        <h3 className="text-sm md:text-lg font-semibold">{name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
