import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isLarge?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isLarge = false }) => {
  // Always use the poster (imageUrl) for the card grid to ensure alignment
  const displayImage = movie.imageUrl;

  return (
    <div 
      onClick={() => onClick(movie)}
      className={`relative flex-none group cursor-pointer transition-all duration-300 ease-in-out z-10 hover:z-50 hover:scale-110 
      ${isLarge ? 'w-[160px] md:w-[200px]' : 'w-[110px] md:w-[150px]'}`}
    >
      <div className={`relative w-full rounded-md overflow-hidden bg-[#202020] shadow-md
        ${isLarge ? 'h-[240px] md:h-[300px]' : 'h-[165px] md:h-[225px]'}`}
      >
          <img
            src={displayImage}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay for legibility on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 md:p-3">
             <h4 className="text-white font-bold text-xs md:text-sm drop-shadow-md line-clamp-2 leading-tight mb-1">{movie.title}</h4>
             <div className="flex items-center space-x-2 text-[10px] text-green-400">
                <span className="font-bold">{movie.matchScore}%</span>
                <span className="text-gray-300 border border-gray-500 px-1 rounded-sm">{movie.rating}</span>
             </div>
             <div className="flex flex-wrap gap-1 mt-1 hidden md:flex">
                 {movie.genre.slice(0, 2).map((g, i) => (
                     <span key={i} className="text-[9px] text-gray-300 flex items-center">
                        {i > 0 && <span className="mr-1 mx-1">•</span>}
                        {g}
                     </span>
                 ))}
             </div>
          </div>
      </div>
    </div>
  );
};