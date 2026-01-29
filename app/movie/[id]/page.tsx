import { Metadata } from 'next';
import { getMovieById } from '@/lib/api';
import MovieDetailClient from './MovieDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await getMovieById(parseInt(params.id));
  
  if (!movie) {
    return {
      title: 'Movie Not Found - Reckall',
    };
  }

  return {
    title: `${movie.title} (${movie.year}) - Reckall`,
    description: movie.overview || `Learn more about ${movie.title} on Reckall`,
    openGraph: {
      title: `${movie.title} (${movie.year})`,
      description: movie.overview || `Discover ${movie.title} on Reckall`,
      images: movie.backdrop_url ? [movie.backdrop_url] : [],
    },
  };
}

export default async function MoviePage({ params }: Props) {
  const movie = await getMovieById(parseInt(params.id));

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted mb-8">The movie you're looking for doesn't exist.</p>
          <a href="/" className="text-primary hover:underline">← Back to Home</a>
        </div>
      </div>
    );
  }

  return <MovieDetailClient movie={movie} />;
}
