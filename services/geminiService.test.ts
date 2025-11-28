import { describe, it, expect } from 'vitest';
import { getImageUrl, resolveMovieImages } from './geminiService';
import { Movie } from '../types';

describe('Gemini Service Utilities', () => {
  describe('getImageUrl', () => {
    it('should generate a consistent poster URL based on the title seed', () => {
      const title = 'Inception';
      const url1 = getImageUrl(title, 'poster');
      const url2 = getImageUrl(title, 'poster');
      
      // Ensure determinism
      expect(url1).toBe(url2);
      expect(url1).toContain('picsum.photos/seed/Inception/300/450');
    });

    it('should generate a consistent backdrop URL', () => {
      const url = getImageUrl('Dune', 'backdrop');
      expect(url).toContain('picsum.photos/seed/Dune/1280/720');
    });

    it('should handle special characters in title for seed generation', () => {
      // The function removes non-alphanumeric characters for the seed
      const url = getImageUrl('Face/Off', 'poster');
      expect(url).toContain('picsum.photos/seed/FaceOff/300/450');
    });
  });

  describe('resolveMovieImages', () => {
    const baseMovie: Movie = {
      id: '123',
      title: 'Test Movie',
      description: 'A test movie description',
      genre: ['Action'],
      year: 2024,
      rating: 8.5,
      director: 'Test Director'
    };

    it('should prioritize TMDB paths if they exist', () => {
      const movieWithPaths: Movie = {
        ...baseMovie,
        posterPath: '/path-to-poster.jpg',
        backdropPath: '/path-to-backdrop.jpg'
      };

      const result = resolveMovieImages(movieWithPaths);

      expect(result.imageUrl).toBe('https://image.tmdb.org/t/p/w500/path-to-poster.jpg');
      expect(result.backdropUrl).toBe('https://image.tmdb.org/t/p/original/path-to-backdrop.jpg');
    });

    it('should fallback to generated URLs if TMDB paths are missing', () => {
      // No posterPath or backdropPath provided
      const result = resolveMovieImages(baseMovie);

      expect(result.imageUrl).toContain('picsum.photos/seed/TestMovie/300/450');
      expect(result.backdropUrl).toContain('picsum.photos/seed/TestMovie/1280/720');
    });

    it('should preserve existing absolute URLs if provided and no TMDB path exists', () => {
      const movieWithUrl: Movie = {
        ...baseMovie,
        imageUrl: 'https://example.com/existing-poster.jpg'
      };

      const result = resolveMovieImages(movieWithUrl);
      
      // Logic: If posterPath is missing, it checks for existing imageUrl before falling back to picsum
      // However, current implementation of resolveMovieImages:
      // if (!poster) poster = getImageUrl(...)
      // So if imageUrl is passed in, it should be preserved.
      expect(result.imageUrl).toBe('https://example.com/existing-poster.jpg');
    });
  });
});
