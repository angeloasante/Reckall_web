import { Metadata } from 'next';
import { getMovieById, buildImageUrl } from '@/lib/api';
import MovieDetailClient from './MovieDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await getMovieById(parseInt(params.id));
  
  if (!movie) {
    return {
      title: 'Movie Not Found',
    };
  }

  const title = `${movie.title} (${movie.year || 'N/A'}) - Where to Watch, Cast & More`;
  const description = movie.overview 
    ? `${movie.overview.substring(0, 155)}...` 
    : `Find where to watch ${movie.title}, see the full cast, and discover similar movies on Reckall.`;
  const imageUrl = movie.backdrop_url || movie.poster_url || '';

  return {
    title,
    description,
    keywords: [movie.title, 'where to watch', 'streaming', 'cast', 'movie', String(movie.year)],
    openGraph: {
      title: `${movie.title} (${movie.year || 'N/A'})`,
      description,
      type: 'video.movie',
      url: `https://reckall.app/movie/${params.id}`,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1280,
          height: 720,
          alt: movie.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title} (${movie.year || 'N/A'})`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `https://reckall.app/movie/${params.id}`,
    },
  };
}

// Generate JSON-LD structured data for SEO
function generateMovieJsonLd(movie: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    datePublished: movie.year ? `${movie.year}-01-01` : undefined,
    image: movie.poster_url || movie.backdrop_url,
    url: `https://reckall.app/movie/${movie.tmdb_id || movie.id}`,
    aggregateRating: movie.vote_average ? {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      bestRating: 10,
      ratingCount: movie.vote_count || 1,
    } : undefined,
  };
}

export default async function MoviePage({ params }: Props) {
  const movie = await getMovieById(parseInt(params.id));

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted mb-8">The movie you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/" className="text-primary hover:underline">← Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateMovieJsonLd(movie)),
        }}
      />
      <MovieDetailClient movie={movie} />
    </>
  );
}
