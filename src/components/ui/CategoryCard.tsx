
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  count: number;
  image: string;
  id?: string;
  productCount?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, count, image, id }) => {
  // Use the category name as the ID if no explicit ID is provided
  const categoryId = id || name.toLowerCase();
  
  return (
    <Link to={`/categories/${categoryId}`} className="block group">
      <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white text-xl md:text-2xl font-medium">{name}</h3>
          <p className="text-gray-200 mt-1">{count} Products</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
