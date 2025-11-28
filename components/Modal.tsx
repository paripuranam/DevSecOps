import React, { useEffect, useState } from 'react';
import { X, Play, Plus, ThumbsUp, Volume2 } from 'lucide-react';
import { Movie, MovieDetails } from '../types';
import { generateMovieDetails, getImageUrl } from '../services/geminiService';

interface ModalProps {
  movie: Movie;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ movie, onClose }) => {
  const [details, setDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    // Enhance movie data with AI generated details
    const fetchDetails = async () => {
        const extraData = await generateMovieDetails(movie);
        setDetails({ ...movie, ...extraData });
    };
    fetchDetails();
  }, [movie]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const displayMovie = details || movie;
  const image = displayMovie.backdropUrl || getImageUrl(displayMovie.title, 'backdrop');

  return (
    <div className="fixed inset-0 z-[100] flex justify-center overflow-y-auto bg-black/60 backdrop-blur-sm pt-8 px-4" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl bg-[#181818] rounded-lg shadow-2xl overflow-hidden animate-fade-in-up mb-8 h-fit"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 bg-[#181818] rounded-full p-2 hover:bg-white/20 transition"
        >
            <X className="w-6 h-6 text-white" />
        </button>

        {/* Video/Image Header */}
        <div className="relative aspect-video w-full">
            <img src={image} alt={displayMovie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-10 left-8 md:left-12 space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-xl">{displayMovie.title}</h2>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 bg-white text-black px-8 py-2 rounded font-bold hover:bg-opacity-80 transition">
                        <Play className="w-6 h-6 fill-black" />
                        <span>Play</span>
                    </button>
                    <button className="border-2 border-gray-400 rounded-full p-2 text-gray-400 hover:border-white hover:text-white transition">
                        <Plus className="w-5 h-5" />
                    </button>
                    <button className="border-2 border-gray-400 rounded-full p-2 text-gray-400 hover:border-white hover:text-white transition">
                        <ThumbsUp className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="absolute bottom-10 right-12 hidden md:block">
                 <button className="border border-white/20 bg-black/30 rounded-full p-2 text-white/70 hover:text-white">
                    <Volume2 className="w-5 h-5" />
                 </button>
            </div>
        </div>

        {/* Info Content */}
        <div className="px-8 md:px-12 py-6 grid md:grid-cols-[2fr_1fr] gap-8 text-white">
            <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm font-semibold">
                    <span className="text-green-400">{displayMovie.matchScore}% Match</span>
                    <span>{displayMovie.year}</span>
                    <span className="border border-gray-500 px-1 text-xs">HD</span>
                </div>
                <p className="text-lg leading-relaxed text-gray-200">
                    {displayMovie.description}
                </p>
                <div className="border-t border-gray-700 pt-4 mt-4">
                    <h4 className="font-bold text-lg mb-2 text-gray-300">AI Analysis</h4>
                    <p className="text-sm text-gray-400 italic">
                        "A quintessential {displayMovie.genre.join('/')} experience. {details ? `The mood is distinctly ${details.mood}.` : 'Loading analysis...'}"
                    </p>
                </div>
            </div>

            <div className="space-y-4 text-sm">
                <div>
                    <span className="text-gray-500">Cast: </span>
                    <span className="text-gray-200">{details?.cast?.join(', ') || 'Loading...'}</span>
                </div>
                <div>
                    <span className="text-gray-500">Genres: </span>
                    <span className="text-gray-200">{displayMovie.genre.join(', ')}</span>
                </div>
                <div>
                    <span className="text-gray-500">Director: </span>
                    <span className="text-gray-200">{displayMovie.director}</span>
                </div>
                <div>
                     <span className="text-gray-500">Duration: </span>
                     <span className="text-gray-200">{details?.duration || '--'}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
