'use client';

import { motion } from 'framer-motion';
import { StreamingProvider } from '@/lib/api';
import Image from 'next/image';

interface Props {
  providers: StreamingProvider[];
  loading?: boolean;
  onRefresh?: () => void;
  justWatchUrl?: string | null;
}

// Streaming service brand colors
const SERVICE_COLORS: Record<string, string> = {
  'netflix': '#E50914',
  'amazon prime video': '#00A8E1',
  'prime video': '#00A8E1',
  'amazon video': '#00A8E1',
  'disney+': '#113CCF',
  'disney plus': '#113CCF',
  'hulu': '#1CE783',
  'max': '#741DDA',
  'hbo max': '#741DDA',
  'apple tv+': '#000000',
  'apple tv': '#000000',
  'apple tv store': '#000000',
  'peacock': '#FDB927',
  'peacock premium': '#FDB927',
  'paramount+': '#0064FF',
  'paramount plus': '#0064FF',
  'youtube': '#FF0000',
  'youtube premium': '#FF0000',
  'tubi': '#FA382F',
  'tubi tv': '#FA382F',
  'pluto tv': '#2E236C',
  'vudu': '#35BEE8',
  'fandango at home': '#35BEE8',
  'google play': '#4285F4',
  'google play movies': '#4285F4',
  'itunes': '#FB5BC5',
  'crunchyroll': '#F47521',
  'shudder': '#C31432',
  'mubi': '#2C2C2C',
  'starz': '#000000',
  'showtime': '#B71818',
  'mgm+': '#D4AF37',
  'amc+': '#20232A',
  'freevee': '#36C2B4',
  'kanopy': '#2D9CDB',
};

const getServiceColor = (name: string): string => {
  const key = name.toLowerCase();
  // Try exact match first
  if (SERVICE_COLORS[key]) return SERVICE_COLORS[key];
  // Try partial match
  for (const [colorKey, color] of Object.entries(SERVICE_COLORS)) {
    if (key.includes(colorKey) || colorKey.includes(key)) {
      return color;
    }
  }
  return '#6366F1'; // Default purple
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'subscription': return '';
    case 'rent': return 'Rent';
    case 'buy': return 'Buy';
    case 'free': return 'Free';
    default: return '';
  }
};

export default function StreamingButtons({ providers, loading, onRefresh, justWatchUrl }: Props) {
  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 animate-pulse">
            <div className="h-12 w-32 rounded-xl bg-secondary/50" />
          </div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted">
          No streaming options found.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  // Group and deduplicate providers - prioritize subscription, then free, then rent, then buy
  const seen = new Set<string>();
  const uniqueProviders: StreamingProvider[] = [];
  
  // Order: subscription first, then free, then rent, then buy
  const sortedProviders = [...providers].sort((a, b) => {
    const order = { subscription: 0, free: 1, rent: 2, buy: 3 };
    return (order[a.type] ?? 4) - (order[b.type] ?? 4);
  });

  for (const p of sortedProviders) {
    const key = p.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueProviders.push(p);
    }
  }

  const renderProviderButton = (provider: StreamingProvider, index: number) => {
    const color = getServiceColor(provider.name);
    const typeLabel = getTypeLabel(provider.type);
    const linkUrl = provider.url || justWatchUrl || '#';
    const hasRealUrl = provider.url || justWatchUrl;
    
    return (
      <motion.a
        key={`${provider.name}-${provider.provider_id}-${index}`}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: color }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={(e) => { if (!hasRealUrl) e.preventDefault(); }}
      >
        {/* Provider Logo */}
        {provider.logo_url ? (
          <div className="relative w-6 h-6 rounded overflow-hidden bg-white/20 flex-shrink-0">
            <Image
              src={provider.logo_url}
              alt={provider.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">
            📺
          </div>
        )}
        
        {/* Provider Name + Type */}
        <span className="font-medium text-white text-sm whitespace-nowrap">
          {provider.name.replace(' Plus', '+').replace(' Premium', '+')}
          {typeLabel && <span className="ml-1.5 opacity-75">• {typeLabel}</span>}
        </span>
      </motion.a>
    );
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {uniqueProviders.map((provider, index) => renderProviderButton(provider, index))}
      
      {/* JustWatch Attribution */}
      {justWatchUrl && (
        <motion.a
          href={justWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: uniqueProviders.length * 0.05 }}
        >
          <span className="text-yellow-500 text-sm font-medium">JustWatch</span>
          <span className="text-muted text-xs">→</span>
        </motion.a>
      )}
    </div>
  );
}
