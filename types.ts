export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  year: number;
  rating: number; // 0-10
  director: string;
  matchScore?: number; // 0-100%
  imageUrl?: string; // Final resolved URL
  backdropUrl?: string; // Final resolved URL
  posterPath?: string; // TMDB partial path
  backdropPath?: string; // TMDB partial path
}

export interface GenreRow {
  title: string;
  movies: Movie[];
}

export enum FetchState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// For the detailed modal
export interface MovieDetails extends Movie {
  cast: string[];
  duration: string;
  mood: string;
}