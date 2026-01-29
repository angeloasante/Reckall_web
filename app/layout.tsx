import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reckall - Identify Any Movie Instantly',
  description: 'Upload a video clip and let AI identify the movie in seconds. Powered by advanced AI recognition technology.',
  keywords: ['movie identification', 'AI', 'video recognition', 'film finder', 'movie app'],
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Reckall - Identify Any Movie Instantly',
    description: 'Upload a video clip and let AI identify the movie in seconds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Spline 3D Background - Fixed behind everything */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <iframe
            src="https://my.spline.design/waveform-gm8Mc7BoEALZZ8ggTHi5kSGc"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ pointerEvents: 'none' }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
