'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" aria-label="Go to Reckall homepage">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="w-10 h-10"
              aria-hidden="true"
            />
            <span className="text-2xl font-bold gradient-text">Reckall</span>
          </motion.div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-sm text-muted hover:text-white transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('recently-identified')} 
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Recent
          </button>
          <motion.a
            href="https://testflight.apple.com/join/pbcmZz3t"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download App
          </motion.a>
        </nav>
      </div>
    </header>
  );
}
