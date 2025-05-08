
import React from 'react';
import { Star } from 'lucide-react';

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Profile and Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-12 h-12 rounded-full object-cover mr-3" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-tommyfx-blue text-white flex items-center justify-center mr-3">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="font-medium">{name}</h4>
            {date && <p className="text-sm text-gray-500">{date}</p>}
          </div>
        </div>
        
        {/* Star Rating */}
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "fill-tommyfx-blue text-tommyfx-blue" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
      
      {/* Comment */}
      <p className="text-gray-700 italic">"{comment}"</p>
    </div>
  );
};

export default TestimonialCard;
