import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://reckall.app'),
  title: {
    default: 'Reckall - Identify Any Movie Instantly | Shazam for Movies',
    template: '%s | Reckall'
  },
  description: 'Reckall is the Shazam for movies. Upload a video clip and let AI identify any movie in seconds. Works with dialogue, scenes, and actors. Available on iOS and web.',
  keywords: ['movie identification', 'AI movie finder', 'video recognition', 'film finder', 'movie app', 'shazam for movies', 'identify movie', 'what movie is this', 'movie scene finder'],
  authors: [{ name: 'Travis Moore' }],
  creator: 'Reckall',
  publisher: 'Reckall',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Reckall - Identify Any Movie Instantly',
    description: 'Upload a video clip and let AI identify the movie in seconds. The Shazam for movies.',
    url: 'https://reckall.app',
    siteName: 'Reckall',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reckall - Shazam for Movies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reckall - Identify Any Movie Instantly',
    description: 'Upload a video clip and let AI identify the movie in seconds.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://reckall.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://czdgfhyeqhhgifmkwham.supabase.co" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://reckallbackend-production.up.railway.app" />
      </head>
      <body className={inter.className}>
        {/* Gradient Background - CSS only, no JS */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        {children}
      </body>
    </html>
  );
}
