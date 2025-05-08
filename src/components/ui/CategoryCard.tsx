
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, image, productCount }) => {
  return (
    <Link to={`/categories/${id}`} className="block group">
      <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white text-xl md:text-2xl font-medium">{name}</h3>
          <p className="text-gray-200 mt-1">{productCount} Products</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
