import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://reckall.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Dynamic movie pages from database
  try {
    const { data: movies } = await supabase
      .from('movies')
      .select('tmdb_id, created_at')
      .order('popularity', { ascending: false })
      .limit(1000);

    const moviePages: MetadataRoute.Sitemap = (movies || []).map((movie) => ({
      url: `${baseUrl}/movie/${movie.tmdb_id}`,
      lastModified: new Date(movie.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...moviePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
