import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  image?: string;
  date?: string;
  product?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  rating,
  comment,
  image,
  date,
  product,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md min-h-[280px] transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col relative">
      {/* Decorative quote icon */}
      <div className="absolute -top-0 -left-2 bg-blue-50 p-2 rounded-full text-blue-500">
        <Quote size={20} />
      </div>
      
      {/* Rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
      
      {/* Comment - with proper height and scrolling if needed */}
      <div className="flex-grow mb-4 min-h-[120px] flex items-start">
        <p className="text-gray-700 italic leading-relaxed">"{comment}"</p>
      </div>
      
      {/* Profile and info - always at bottom */}
      <div className="flex items-center pt-4 border-t border-gray-100 mt-auto">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-3 flex-shrink-0" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
            {name.charAt(0)}
          </div>
        )}
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold truncate">{name}</h4>
          <div className="text-sm text-gray-500">
            {product && <span className="block truncate">{product}</span>}
            {date && <span className="block">{date}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;