'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Go to Reckall homepage">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="w-8 h-8"
              aria-hidden="true"
            />
            <span className="text-2xl font-bold gradient-text">Reckall</span>
          </Link>
          
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:support@reckall.app" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          
          <div className="text-sm text-muted">
            © {new Date().getFullYear()} Reckall. All rights reserved.
          </div>
        </div>
      </div>
      
      {/* Infinite Scroll Marquee at Bottom */}
      <div className="overflow-hidden py-6">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-5xl md:text-7xl font-bold gradient-text mx-12">
              Reckall — Shazam for Movies
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
