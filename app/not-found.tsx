'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Image
              src="/logo.png"
              alt="Reckall"
              width={120}
              height={120}
              className="mx-auto opacity-50"
            />
          </motion.div>
          
          <motion.h1 
            className="text-8xl font-bold gradient-text mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            404
          </motion.h1>
          
          <motion.h2 
            className="text-2xl font-semibold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Scene Not Found
          </motion.h2>
          
          <motion.p 
            className="text-muted mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Looks like this movie clip got lost in the cutting room. 
            Let&apos;s get you back to the main feature.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/">
              <motion.button
                className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-full font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </main>
  );
}
