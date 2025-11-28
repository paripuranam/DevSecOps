import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getImageUrl = (title: string, type: 'poster' | 'backdrop' = 'poster'): string => {
  const seed = title.replace(/[^a-zA-Z0-9]/g, '');
  if (type === 'poster') {
    return `https://picsum.photos/seed/${seed}/300/450`;
  } else {
    return `https://picsum.photos/seed/${seed}/1280/720`;
  }
};

// Helper to construct image URLs. 
// We prioritize the model's knowledge of real TMDB paths.
export const resolveMovieImages = (movie: Movie) => {
  const TMDB_BASE = 'https://image.tmdb.org/t/p/w500';
  const TMDB_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';
  
  let poster = movie.imageUrl;
  let backdrop = movie.backdropUrl;

  // If the model provided a TMDB path (starts with /), use it.
  if (movie.posterPath && movie.posterPath.startsWith('/')) {
    poster = `${TMDB_BASE}${movie.posterPath}`;
  }
  
  if (movie.backdropPath && movie.backdropPath.startsWith('/')) {
    backdrop = `${TMDB_BASE_ORIGINAL}${movie.backdropPath}`;
  }

  // Fallback if no valid URL/path found
  if (!poster) {
    poster = getImageUrl(movie.title, 'poster');
  }
  
  if (!backdrop) {
    backdrop = getImageUrl(movie.title, 'backdrop');
  }

  return { ...movie, imageUrl: poster, backdropUrl: backdrop };
};

export const fetchMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: `Generate a list of 12 real, popular movies that fit the genre "${genre}". 
      You MUST provide the correct TMDB 'poster_path' (e.g. "/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg") and 'backdrop_path' for each movie.
      If you are not 100% sure of the path, do not invent one, but try to be accurate for famous movies.
      Return JSON data.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.ARRAY, items: { type: Type.STRING } },
              year: { type: Type.INTEGER },
              rating: { type: Type.NUMBER },
              director: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              posterPath: { type: Type.STRING, description: "The TMDB poster path starting with /" },
              backdropPath: { type: Type.STRING, description: "The TMDB backdrop path starting with /" }
            },
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as Movie[];
      return data.map(m => resolveMovieImages({
        ...m,
        matchScore: m.matchScore || Math.floor(Math.random() * 20) + 80
      }));
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch movies for ${genre}:`, error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: `User is searching for: "${query}". 
      Generate a list of 12 movies that best match this query. 
      Prioritize real movies and provide their correct TMDB poster_path and backdrop_path.
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.ARRAY, items: { type: Type.STRING } },
              year: { type: Type.INTEGER },
              rating: { type: Type.NUMBER },
              director: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              posterPath: { type: Type.STRING },
              backdropPath: { type: Type.STRING }
            },
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as Movie[];
      return data.map(m => resolveMovieImages(m));
    }
    return [];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

export const generateMovieDetails = async (movie: Movie): Promise<any> => {
    try {
        const ai = getClient();
        const model = 'gemini-2.5-flash';
        
        const response = await ai.models.generateContent({
            model,
            contents: `Generate detailed metadata for the movie "${movie.title}" (${movie.year}).
            Include a 'cast' array (3 names), a 'duration' string (e.g., "1h 45m"), and a 'mood' string.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        cast: { type: Type.ARRAY, items: { type: Type.STRING }},
                        duration: { type: Type.STRING },
                        mood: { type: Type.STRING }
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return { cast: ["Unknown"], duration: "Unknown", mood: "N/A" };
    } catch (e) {
        console.error(e);
        return { cast: [], duration: "N/A", mood: "" };
    }
}