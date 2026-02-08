'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { buildImageUrl } from '@/lib/api';
import Footer from '@/components/Footer';

interface Artist {
  id: number;
  tmdb_id: number;
  name: string;
  profile_url: string | null;
  biography: string | null;
  birthday: string | null;
  birthplace: string | null;
  imdb_id: string | null;
  known_for_department: string;
}

interface FilmographyMovie {
  id: number;
  tmdb_id: number;
  title: string;
  year: number | null;
  poster_url: string | null;
  character?: string;
}

interface ArtistData {
  artist: Artist;
  filmography: FilmographyMovie[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reckallbackend-production.up.railway.app/api';

async function getArtistDetails(id: string): Promise<ArtistData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch artist:', error);
    return null;
  }
}

function calculateAge(birthday: string): number {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function ArtistDetailClient({ artistId }: { artistId: string }) {
  const [data, setData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const artistData = await getArtistDetails(artistId);
      setData(artistData);
      setLoading(false);
    }
    fetchData();
  }, [artistId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </main>
    );
  }

  if (!data?.artist) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
        <Link href="/" className="text-primary hover:underline">
          ← Back to Home
        </Link>
      </main>
    );
  }

  const { artist, filmography } = data;
  const profileUrl = artist.profile_url?.replace('/w185', '/h632') || artist.profile_url;
  const biography = artist.biography || '';
  const shouldTruncateBio = biography.length > 400;
  const displayBio = shouldTruncateBio && !bioExpanded
    ? biography.substring(0, 400) + '...'
    : biography;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh]">
        {/* Background blur of profile */}
        {profileUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={profileUrl}
              alt=""
              fill
              className="object-cover opacity-30 blur-2xl scale-110"
              priority
            />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-6 left-6 z-20 glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </Link>

        {/* Content */}
        <div className="relative z-10 pt-24 md:pt-32 pb-8 px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-end">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              {profileUrl ? (
                <Image
                  src={profileUrl}
                  alt={artist.name}
                  width={200}
                  height={300}
                  className="rounded-2xl shadow-2xl w-40 h-60 md:w-52 md:h-80 object-cover"
                />
              ) : (
                <div className="w-40 h-60 md:w-52 md:h-80 bg-secondary rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </motion.div>

            {/* Artist Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{artist.name}</h1>
              
              {artist.known_for_department && (
                <p className="text-muted text-lg mb-4">{artist.known_for_department}</p>
              )}

              {/* Info Pills */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                {artist.birthday && (
                  <div className="glass px-4 py-2 rounded-full">
                    <span className="text-muted text-sm">Age: </span>
                    <span className="font-medium">{calculateAge(artist.birthday)}</span>
                  </div>
                )}
                {artist.birthplace && (
                  <div className="glass px-4 py-2 rounded-full max-w-xs">
                    <span className="text-muted text-sm">Born in: </span>
                    <span className="font-medium truncate">{artist.birthplace}</span>
                  </div>
                )}
                {filmography.length > 0 && (
                  <div className="glass px-4 py-2 rounded-full">
                    <span className="text-muted text-sm">Credits: </span>
                    <span className="font-medium">{filmography.length}+</span>
                  </div>
                )}
              </div>

              {/* IMDb Link */}
              {artist.imdb_id && (
                <a
                  href={`https://www.imdb.com/name/${artist.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-500/30 transition-colors"
                >
                  View on IMDb →
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Biography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Biography</h2>
            {biography ? (
              <>
                <p className="text-muted text-lg leading-relaxed max-w-4xl">
                  {displayBio}
                </p>
                {shouldTruncateBio && (
                  <button
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="text-primary hover:underline mt-2"
                  >
                    {bioExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </>
            ) : (
              <p className="text-muted">No biography available for {artist.name}.</p>
            )}
          </motion.div>

          {/* Filmography */}
          {filmography.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Known For</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filmography.slice(0, 12).map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/movie/${movie.id}`}>
                      <div className="movie-card rounded-xl overflow-hidden bg-secondary/50 hover:bg-secondary/70 transition-colors">
                        {movie.poster_url ? (
                          <Image
                            src={movie.poster_url}
                            alt={movie.title}
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
                          <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                          <p className="text-xs text-muted">{movie.year}</p>
                          {movie.character && (
                            <p className="text-xs text-primary truncate mt-1">as {movie.character}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
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
