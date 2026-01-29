import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  year: number | null;
  poster_url: string | null;
  backdrop_url: string | null;
  overview: string | null;
  imdb_id: string | null;
  popularity: number;
  created_at: string;
}

export interface CastMember {
  id: number;
  actor_name: string;
  character_name: string | null;
  tmdb_person_id: number | null;
  profile_path?: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reckallbackend-production.up.railway.app/api';

// Recognition result type
export interface RecognitionResult {
  movie: Movie;
  confidence: number;
  matched_on?: string[];
  processing_time?: number;
  actors_detected?: string[];
}

// Get recently identified movies from user_uploads table
export async function getRecentlyIdentified(limit: number = 12): Promise<Movie[]> {
  try {
    const { data, error } = await supabase
      .from('user_uploads')
      .select(`
        id,
        confidence_score,
        created_at,
        movies:result_movie_id (
          id,
          tmdb_id,
          title,
          year,
          poster_url,
          backdrop_url,
          overview,
          imdb_id,
          popularity,
          created_at
        )
      `)
      .not('result_movie_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recently identified:', error);
      return [];
    }

    // Extract unique movies
    const movies: Movie[] = [];
    const seenIds = new Set<number>();
    
    for (const item of data || []) {
      const movie = item.movies as any;
      if (movie && !seenIds.has(movie.id)) {
        seenIds.add(movie.id);
        movies.push(movie);
      }
    }

    return movies;
  } catch (error) {
    console.error('Failed to fetch recently identified:', error);
    return [];
  }
}

export async function getRecentMovies(limit: number = 12): Promise<Movie[]> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching movies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch recent movies:', error);
    return [];
  }
}

// Recognize video - calls the backend API
export async function recognizeVideo(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<RecognitionResult> {
  const formData = new FormData();
  formData.append('video', file);

  onProgress?.(10, 'Uploading video...');

  const response = await fetch(`${API_BASE_URL}/recognize-fast`, {
    method: 'POST',
    body: formData,
  });

  onProgress?.(50, 'Analyzing video...');

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Recognition failed' }));
    throw new Error(error.error || 'Failed to identify movie');
  }

  const result = await response.json();
  
  onProgress?.(100, 'Movie identified!');

  if (!result.movie) {
    throw new Error('Could not identify the movie. Try a different clip with clearer dialogue.');
  }

  return result;
}

export async function getMovieById(id: number): Promise<Movie | null> {
  try {
    // First try to get from our database
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .or(`id.eq.${id},tmdb_id.eq.${id}`)
      .single();

    if (data) {
      return data;
    }

    // If not in DB, fetch from TMDB via our API
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch movie:', error);
    return null;
  }
}

// In-memory cache for cast data
const castCache = new Map<number, { data: CastMember[]; timestamp: number }>();
const CAST_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export async function getMovieCast(movieId: number): Promise<CastMember[]> {
  try {
    // Check cache first
    const cached = castCache.get(movieId);
    if (cached && Date.now() - cached.timestamp < CAST_CACHE_TTL) {
      console.log('Using cached cast for movie:', movieId);
      return cached.data;
    }

    // Use backend API endpoint (same as mobile app)
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}/cast`);
    
    if (!response.ok) {
      console.log('Cast API returned status:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (data.cast && data.cast.length > 0) {
      const castMembers: CastMember[] = data.cast.map((c: any) => ({
        id: c.id,
        actor_name: c.name,
        character_name: c.character,
        tmdb_person_id: c.tmdb_id,
        profile_path: c.profile_url,
      }));
      
      // Store in cache
      castCache.set(movieId, { data: castMembers, timestamp: Date.now() });
      
      return castMembers;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch cast:', error);
    return [];
  }
}

// In-memory cache for similar movies
const similarCache = new Map<number, { data: Movie[]; timestamp: number }>();
const SIMILAR_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  try {
    // Check cache first
    const cached = similarCache.get(movieId);
    if (cached && Date.now() - cached.timestamp < SIMILAR_CACHE_TTL) {
      console.log('Using cached similar movies for:', movieId);
      return cached.data;
    }

    const response = await fetch(`${API_BASE_URL}/movies/${movieId}/similar`);
    if (response.ok) {
      const data = await response.json();
      const similar = data.similar || [];
      
      // Store in cache
      similarCache.set(movieId, { data: similar, timestamp: Date.now() });
      
      return similar;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch similar movies:', error);
    return [];
  }
}

export function buildImageUrl(path: string | null, size: 'w200' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
