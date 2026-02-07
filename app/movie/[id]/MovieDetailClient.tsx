'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, CastMember, StreamingProvider, getMovieCast, getSimilarMovies, getStreamingProviders, buildImageUrl } from '@/lib/api';
import { getYouTubeTrailerLink, openDeepLink } from '@/lib/deeplinks';
import StreamingButtons from '@/components/StreamingButtons';
import Footer from '@/components/Footer';

interface Props {
  movie: Movie;
}

export default function MovieDetailClient({ movie }: Props) {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [streamingProviders, setStreamingProviders] = useState<StreamingProvider[]>([]);
  const [justWatchUrl, setJustWatchUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamingLoading, setStreamingLoading] = useState(true);
  const [showStreamingModal, setShowStreamingModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [castData, similarData] = await Promise.all([
          getMovieCast(movie.id),
          getSimilarMovies(movie.id), // Use database ID, not tmdb_id
        ]);
        console.log('Cast data:', castData);
        console.log('Similar movies:', similarData);
        setCast(castData);
        setSimilarMovies(similarData);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [movie.id]);

  // Fetch streaming data separately (can take longer due to API call)
  useEffect(() => {
    async function fetchStreaming() {
      setStreamingLoading(true);
      try {
        const data = await getStreamingProviders(movie.id);
        setStreamingProviders(data.providers);
        setJustWatchUrl(data.justwatch_url || null);
      } catch (error) {
        console.error('Error fetching streaming data:', error);
      } finally {
        setStreamingLoading(false);
      }
    }
    fetchStreaming();
  }, [movie.id]);

  const handleRefreshStreaming = async () => {
    setStreamingLoading(true);
    try {
      const data = await getStreamingProviders(movie.id, true);
      setStreamingProviders(data.providers);
      setJustWatchUrl(data.justwatch_url || null);
    } catch (error) {
      console.error('Error refreshing streaming data:', error);
    } finally {
      setStreamingLoading(false);
    }
  };

  const backdropUrl = movie.backdrop_url || movie.poster_url;

  // Get the primary streaming option (first subscription service, or first available)
  const primaryStreaming = streamingProviders.find(p => p.type === 'subscription') || streamingProviders[0];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Backdrop */}
      <section className="relative h-[70vh] min-h-[500px]">
        {/* Backdrop Image */}
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-6 left-6 z-20 glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </Link>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  width={250}
                  height={375}
                  className="rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-[250px] h-[375px] bg-secondary rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">🎬</span>
                </div>
              )}
            </motion.div>

            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex items-center gap-4 text-muted mb-6">
                {movie.year && <span className="text-lg">{movie.year}</span>}
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-500/30 transition-colors"
                  >
                    IMDb
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => openDeepLink(getYouTubeTrailerLink(movie.title, movie.year))}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Watch Trailer</span>
                </motion.button>
                
                {/* Streaming Button - Shows primary service or "Where to Watch" */}
                {streamingLoading ? (
                  <motion.div
                    className="bg-primary/50 px-6 py-3 rounded-xl flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Finding streams...</span>
                  </motion.div>
                ) : primaryStreaming ? (
                  <motion.a
                    href={primaryStreaming.url || justWatchUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { if (!primaryStreaming.url && !justWatchUrl) { e.preventDefault(); setShowStreamingModal(true); } }}
                  >
                    {primaryStreaming.logo_url ? (
                      <Image
                        src={primaryStreaming.logo_url}
                        alt={primaryStreaming.name}
                        width={20}
                        height={20}
                        className="rounded"
                        unoptimized
                      />
                    ) : (
                      <span>📺</span>
                    )}
                    <span>Watch on {primaryStreaming.name}</span>
                  </motion.a>
                ) : (
                  <motion.button
                    onClick={() => setShowStreamingModal(true)}
                    className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📺</span>
                    <span>Where to Watch</span>
                  </motion.button>
                )}

                {/* More Options Button */}
                {streamingProviders.length > 1 && (
                  <motion.button
                    onClick={() => setShowStreamingModal(true)}
                    className="bg-secondary hover:bg-secondary/80 px-4 py-3 rounded-xl flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>+{streamingProviders.length - 1} more</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Streaming Modal */}
      {showStreamingModal && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowStreamingModal(false)}
        >
          <motion.div 
            className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Where to Watch</h3>
              <button 
                onClick={() => setShowStreamingModal(false)}
                className="text-muted hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <StreamingButtons 
              providers={streamingProviders} 
              loading={streamingLoading}
              onRefresh={handleRefreshStreaming}
              justWatchUrl={justWatchUrl}
            />
          </motion.div>
        </div>
      )}

      {/* Details Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted text-lg leading-relaxed max-w-4xl">
              {movie.overview || 'No overview available for this movie.'}
            </p>
          </motion.div>

          {/* Where to Watch Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span>📺</span> Where to Watch
            </h2>
            <StreamingButtons 
              providers={streamingProviders} 
              loading={streamingLoading}
              onRefresh={handleRefreshStreaming}
            />
          </motion.div>

          {/* Cast Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-32 text-center animate-pulse">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-secondary/50" />
                    <div className="h-4 bg-secondary/50 rounded w-20 mx-auto mb-2" />
                    <div className="h-3 bg-secondary/50 rounded w-16 mx-auto" />
                  </div>
                ))}
              </div>
            ) : cast.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {cast.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-32 text-center"
                  >
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-secondary">
                      {member.profile_path ? (
                        <Image
                          src={buildImageUrl(member.profile_path, 'w200') || ''}
                          alt={member.actor_name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          👤
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-sm truncate">{member.actor_name}</p>
                    {member.character_name && (
                      <p className="text-xs text-muted truncate">{member.character_name}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Cast information not available.</p>
            )}
          </motion.div>

          {/* Similar Movies Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-xl overflow-hidden bg-secondary/50">
                      <div className="w-full aspect-[2/3] bg-secondary/30" />
                      <div className="p-3">
                        <div className="h-4 bg-secondary/50 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-secondary/50 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : similarMovies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarMovies.slice(0, 6).map((similar, index) => (
                  <motion.div
                    key={similar.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/movie/${similar.id}`}>
                      <div className="movie-card rounded-xl overflow-hidden bg-secondary/50 hover:bg-secondary/70 transition-colors">
                        {similar.poster_url ? (
                          <Image
                            src={similar.poster_url}
                            alt={similar.title}
                            width={200}
                            height={300}
                            className="w-full aspect-[2/3] object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">
                            <span className="text-4xl">🎬</span>
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="font-medium text-sm truncate">{similar.title}</h3>
                          <p className="text-xs text-muted">{similar.year}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No similar movies found.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="px-4 py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Identify Movies Instantly</h2>
          <p className="text-muted mb-8">
            Download Reckall to identify any movie from a video clip in seconds.
          </p>
          <motion.a
            href="https://testflight.apple.com/join/pbcmZz3t"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Reckall
          </motion.a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
