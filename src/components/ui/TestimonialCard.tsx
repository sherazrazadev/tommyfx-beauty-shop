
import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  image?: string;
  date?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  rating,
  comment,
  image,
  date,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col relative">
      {/* Decorative quote icon */}
      <div className="absolute -top-3 -left-3 bg-blue-50 p-2 rounded-full text-blue-500">
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
      
      {/* Comment */}
      <p className="text-gray-700 italic flex-grow mb-4">"{comment}"</p>
      
      {/* Profile and info */}
      <div className="flex items-center pt-4 border-t border-gray-100">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-3" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center mr-3">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-semibold">{name}</h4>
          {date && <p className="text-sm text-gray-500">{date}</p>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
