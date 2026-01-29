'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getRecentlyIdentified, recognizeVideo, Movie, RecognitionResult } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const movies = await getRecentlyIdentified(24);
        setRecentMovies(movies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    const fileSizeMB = file.size / (1024 * 1024);
    setUploadMessage(fileSizeMB > 25 ? 'Uploading large video...' : 'Uploading video...');

    try {
      const result = await recognizeVideo(
        file,
        (progress, message) => {
          setUploadProgress(progress);
          setUploadMessage(message);
        }
      );

      // Navigate to movie detail page
      const movieId = result.movie.tmdb_id || result.movie.id;
      router.push(`/movie/${movieId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to identify movie');
      setIsUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Upload Progress Modal */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass p-10 rounded-3xl text-center max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                    className="text-primary transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{uploadProgress}%</span>
                </div>
              </div>
              <p className="text-lg text-muted">{uploadMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-background" />

        <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Reckall
              </motion.h1>
              
              <p className="text-xl md:text-2xl text-muted mb-4">
                Identify Any Movie Instantly
              </p>
              
              <p className="text-lg text-muted/70 mb-10 max-w-xl">
                Upload a video clip and let our AI identify the movie in seconds. 
                Works with dialogue, scenes, and actors.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <motion.a
                  href="https://testflight.apple.com/join/pbcmZz3t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-muted">Download on the</div>
                    <div className="text-base font-semibold">App Store</div>
                  </div>
                </motion.a>
                
                <motion.a
                  href="#"
                  className="glass px-6 py-3 rounded-2xl flex items-center gap-3 opacity-50 cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-muted">Coming soon to</div>
                    <div className="text-base font-semibold">Google Play</div>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Right side - Upload area */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <motion.div
                onClick={handleUploadClick}
                className="relative w-full max-w-md aspect-[4/5] rounded-3xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm cursor-pointer overflow-hidden group"
                whileHover={{ scale: 1.02, borderColor: 'rgba(139, 92, 246, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex flex-col items-center justify-center h-full p-8 text-center">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-2">Try It Now</h3>
                  <p className="text-muted mb-4">
                    Upload a video clip to identify the movie
                  </p>
                  
                  <motion.button
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Upload Video
                  </motion.button>
                  
                  <p className="text-sm text-muted/60 mt-4">
                    MP4, MOV, AVI supported
                  </p>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className="absolute bottom-6 left-6 right-6 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                How It Works
              </motion.h2>
              <motion.p 
                className="text-muted mb-12 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                We believe movie recognition should be effortless. That&apos;s why we designed Reckall to work in just three simple steps upload, analyze, and discover.
              </motion.p>
              
              {/* Overlapping Images */}
              <motion.div 
                className="relative h-80 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute left-0 top-0 w-48 h-64 rounded-2xl overflow-hidden shadow-xl rotate-[-6deg] z-10 border border-white/10">
                  <Image
                    src="https://image.tmdb.org/t/p/w500/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg"
                    alt="Movie scene"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute left-32 top-8 w-48 h-64 rounded-2xl overflow-hidden shadow-xl rotate-[4deg] border border-white/10">
                  <Image
                    src="https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
                    alt="Movie scene"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
              
              <motion.button
                className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
              >
                Try It Now
              </motion.button>
            </div>
            
            {/* Right Column - Steps */}
            <div className="space-y-2">
              {[
                {
                  number: '01',
                  title: 'Upload a Clip',
                  description: 'Select any video clip from your device. Even a few seconds of footage with dialogue is enough.',
                },
                {
                  number: '02',
                  title: 'AI Analysis',
                  description: 'Our models analyze dialogue, recognize actors, and process visual scenes to identify the movie.',
                },
                {
                  number: '03',
                  title: 'Get Results',
                  description: 'See the movie title, full cast, streaming options, and similar recommendations instantly.',
                },
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  {/* Curved Arrow (except for first item) */}
                  {index > 0 && (
                    <div className="flex justify-start ml-4 -mt-2 mb-2">
                      <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="text-white/50">
                        <path d="M12 0 C12 20, 12 20, 20 38" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <path d="M16 34 L20 38 L24 34" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <span className="text-sm text-muted">{step.number}</span>
                        <div className="w-8 h-0.5 bg-primary mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                      </div>
                      <p className="text-muted text-sm max-w-[180px]">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Movies Section */}
      <section id="recently-identified" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Recently Identified
          </h2>
          <p className="text-center text-muted mb-12">
            Movies our users have discovered with Reckall
          </p>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentMovies.map((movie) => (
                <div key={movie.id}>
                  <Link href={`/movie/${movie.tmdb_id || movie.id}`}>
                    <div className="movie-card rounded-xl overflow-hidden bg-secondary/50">
                      {movie.poster_url ? (
                        <Image
                          src={movie.poster_url}
                          alt={movie.title}
                          width={200}
                          height={300}
                          className="w-full aspect-[2/3] object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">
                          <span className="text-4xl">🎬</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                        <p className="text-xs text-muted">{movie.year}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Identify Movies?
            </h2>
            <p className="text-xl text-muted mb-10">
              Download Reckall now and never wonder "what movie is this?" again.
            </p>
            <motion.a
              href="https://testflight.apple.com/join/pbcmZz3t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full text-lg font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Free
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
