import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { fetchMoviesByGenre } from '../services/geminiService';

interface RowProps {
  title: string;
  isLarge?: boolean;
  onMovieClick: (movie: Movie) => void;
  staticMovies?: Movie[]; // Optional pre-loaded movies
}

export const Row: React.FC<RowProps> = ({ title, isLarge = false, onMovieClick, staticMovies }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movie[]>(staticMovies || []);
  const [loading, setLoading] = useState(!staticMovies);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!staticMovies) {
      const load = async () => {
        setLoading(true);
        // Add a small random delay to staggering requests
        await new Promise(r => setTimeout(r, Math.random() * 1500));
        const fetched = await fetchMoviesByGenre(title);
        setMovies(fetched);
        setLoading(false);
      };
      load();
    }
  }, [title, staticMovies]);

  const handleScroll = (direction: 'left' | 'right') => {
    setHasScrolled(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
     // Consistent Skeleton Loader
     return (
         <div className="space-y-2 px-4 md:px-16 my-8">
            <div className="h-5 w-40 bg-[#202020] rounded animate-pulse"></div>
            <div className="flex space-x-2 md:space-x-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className={`bg-[#202020] rounded-md animate-pulse flex-none ${isLarge ? 'w-[160px] h-[240px] md:w-[200px] md:h-[300px]' : 'w-[110px] h-[165px] md:w-[150px] md:h-[225px]'}`}></div>
                ))}
            </div>
         </div>
     )
  }

  if (movies.length === 0) return null;

  return (
    <div className="my-8 space-y-3 group relative">
      <h2 className="text-[#e5e5e5] text-lg md:text-xl font-bold px-4 md:px-16 transition-colors hover:text-white cursor-pointer inline-block">
        {title}
      </h2>
      
      <div className="relative group">
        <ChevronLeft 
            className={`absolute top-0 bottom-0 left-2 md:left-4 z-40 m-auto h-12 w-12 cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-110 text-white bg-black/50 rounded-full p-2 ${!hasScrolled ? 'hidden' : ''}`}
            onClick={() => handleScroll('left')}
        />

        <div 
          ref={rowRef}
          className="flex items-center space-x-2 md:space-x-4 overflow-x-scroll no-scrollbar px-4 md:px-16 pb-4 scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isLarge={isLarge} onClick={onMovieClick} />
          ))}
        </div>

        <ChevronRight 
            className="absolute top-0 bottom-0 right-2 md:right-4 z-40 m-auto h-12 w-12 cursor-pointer opacity-0 transition group-hover:opacity-100 hover:scale-110 text-white bg-black/50 rounded-full p-2"
            onClick={() => handleScroll('right')}
        />
      </div>
    </div>
  );
};