import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie | null;
  onMoreInfo: (movie: Movie) => void;
}

export const Hero: React.FC<HeroProps> = ({ movie, onMoreInfo }) => {
  if (!movie) {
    return (
      <div className="relative h-[70vh] bg-[#141414] animate-pulse w-full">
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
         </div>
      </div>
    );
  }

  // Use backdrop, fallback to poster if needed, but Hero typically needs landscape
  const bgImage = movie.backdropUrl || movie.imageUrl;

  return (
    <div className="relative h-[56.25vw] min-h-[60vh] md:min-h-[85vh] w-full text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img 
          src={bgImage}
          alt={movie.title} 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradients for text readability and blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute top-[20%] md:top-[25%] left-4 md:left-16 max-w-xl space-y-4 md:space-y-6 z-10">
        <div className="flex items-center space-x-3 opacity-90">
             <div className="bg-[#E50914] text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-[2px] tracking-wider uppercase shadow-sm">Series</div>
             {movie.matchScore && <span className="text-[#46d369] font-bold text-sm drop-shadow-md">{movie.matchScore}% Match</span>}
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-none tracking-tight">
          {movie.title}
        </h1>
        
        <div className="flex items-center space-x-3 text-sm text-gray-200 font-semibold drop-shadow-md">
            <span>{movie.year}</span>
            <span className="border border-gray-400 px-1 text-[10px] rounded-[2px] bg-black/20">HD</span>
            <span>{movie.rating} Rating</span>
        </div>

        <p className="text-sm md:text-lg text-white drop-shadow-md line-clamp-3 leading-relaxed max-w-lg shadow-black">
          {movie.description}
        </p>

        <div className="flex items-center space-x-3 pt-2">
          <button className="flex items-center space-x-2 bg-white text-black px-6 py-2 md:px-8 md:py-2.5 rounded hover:bg-white/90 transition active:scale-95 font-bold text-base md:text-lg">
            <Play className="fill-black w-6 h-6" />
            <span>Play</span>
          </button>
          <button 
            onClick={() => onMoreInfo(movie)}
            className="flex items-center space-x-2 bg-[rgba(109,109,110,0.7)] text-white px-6 py-2 md:px-8 md:py-2.5 rounded hover:bg-[rgba(109,109,110,0.5)] transition active:scale-95 font-bold text-base md:text-lg backdrop-blur-sm">
            <Info className="w-6 h-6" />
            <span>More Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};