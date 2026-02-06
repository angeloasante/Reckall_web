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
  'disney+': '#113CCF',
  'disney plus': '#113CCF',
  'hulu': '#1CE783',
  'max': '#741DDA',
  'hbo max': '#741DDA',
  'apple tv+': '#000000',
  'apple tv': '#000000',
  'peacock': '#000000',
  'paramount+': '#0064FF',
  'paramount plus': '#0064FF',
  'youtube': '#FF0000',
  'youtube premium': '#FF0000',
  'tubi': '#FA382F',
  'pluto tv': '#2E236C',
  'vudu': '#35BEE8',
  'fandango at home': '#35BEE8',
  'google play': '#4285F4',
  'itunes': '#FB5BC5',
  'crunchyroll': '#F47521',
  'shudder': '#C31432',
  'mubi': '#000000',
  'starz': '#000000',
  'showtime': '#B71818',
  'mgm+': '#D4AF37',
  'amc+': '#000000',
  'freevee': '#36C2B4',
  'kanopy': '#2D9CDB',
};

// SVG icons for popular services
const SERVICE_ICONS: Record<string, JSX.Element> = {
  'netflix': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"/>
    </svg>
  ),
  'disney+': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M1.645 0v.545c0 .017-.008.028-.025.03-.071.014-.1.057-.095.129.003.047.003.093.003.14v.002c0 .47 0 .942.002 1.412 0 .053-.014.078-.07.08a.39.39 0 0 0-.108.02c-.152.05-.212.193-.137.333.042.078.112.12.198.135.049.009.06.03.06.074 0 .06.002.119 0 .178-.006.158-.013.316-.017.474-.003.116.029.22.095.314.108.153.26.23.447.228.193-.003.344-.085.45-.245.058-.089.085-.188.084-.294-.002-.171-.008-.343-.015-.514-.003-.083.01-.092.09-.092.04 0 .055-.016.055-.054v-.24c0-.04-.015-.058-.056-.057-.037 0-.074 0-.112-.002-.06-.002-.073-.017-.073-.076 0-.486.001-.972-.002-1.458 0-.04.012-.06.052-.07.047-.01.092-.029.14-.037.11-.018.164-.092.147-.201-.017-.109-.1-.163-.21-.148-.077.01-.077.01-.077-.069V.56c0-.067.003-.133.006-.2.003-.084-.026-.154-.092-.21-.11-.092-.241-.108-.375-.092-.11.013-.176.098-.174.218.002.116.005.232.01.348.003.068-.01.08-.077.078a.64.64 0 0 0-.12.001c-.034.005-.046-.009-.045-.043.003-.084.005-.167.007-.25.003-.086.005-.173.008-.26.004-.118-.054-.21-.158-.264-.082-.043-.17-.054-.26-.042zm18.81.035c-1.143.016-2.166.473-2.994 1.39-.87.964-1.265 2.105-1.23 3.39.032 1.153.457 2.14 1.273 2.95.796.788 1.755 1.207 2.867 1.243.111.003.222.002.333-.003.08-.004.098.022.098.097v.143c0 .059.02.078.077.078h.286c.058 0 .077-.02.077-.078v-.335c0-.083-.012-.094-.091-.094h-.046c-.117 0-.117 0-.117-.117v-1.59c0-.06.02-.078.078-.077h.143c.056 0 .078-.019.077-.076v-.286c0-.055-.018-.078-.074-.078h-.205c-.054 0-.074-.019-.074-.073v-.008c.007-.27.017-.54.02-.81.002-.19-.04-.37-.12-.54-.155-.326-.406-.548-.752-.661-.112-.037-.228-.045-.345-.045-.092 0-.092 0-.092-.093v-.286c0-.056.018-.078.075-.077h.143c.056 0 .078-.019.077-.076v-.286c0-.055-.018-.078-.074-.078h-.205c-.054 0-.074-.019-.074-.073V4.25c0-.12-.002-.239.003-.358.004-.098-.028-.188-.087-.266-.124-.163-.302-.206-.49-.17-.205.04-.325.185-.326.397 0 .165-.001.33.006.495.004.08-.024.1-.1.098-.049-.002-.098.001-.147 0-.049 0-.07.017-.068.066v.256c0 .065.02.083.083.083h.132c.065 0 .082-.021.082-.083 0-.096-.001-.191.002-.287.001-.041.013-.055.054-.054.143.003.286.002.43.002.047 0 .065.016.064.063-.003.201-.002.402-.007.603-.003.129-.048.246-.138.341-.115.121-.26.177-.428.172-.147-.004-.278-.053-.388-.151-.068-.061-.113-.139-.136-.227-.013-.05-.002-.077.053-.077h.195c.054 0 .07-.019.07-.071v-.279c0-.054-.018-.074-.072-.074h-.478c-.054 0-.074.019-.073.073.002.148.002.296 0 .443-.001.076-.025.097-.1.097h-.134c-.07 0-.087-.02-.087-.09v-.25c0-.063.018-.085.083-.085.164.001.328 0 .492.002.05.001.068-.015.067-.066-.003-.167-.002-.334 0-.501.001-.05-.013-.069-.064-.069-.168.002-.336.001-.504.001-.047 0-.067-.016-.066-.063.003-.195.002-.39.004-.584.001-.126.046-.24.134-.331.115-.121.26-.177.428-.172.144.004.276.052.387.148.073.063.12.143.142.237.011.048.002.07-.051.07h-.195c-.054 0-.07.019-.07.071v.279c0 .054.018.074.072.074h.478c.054 0 .074-.019.073-.073a7.59 7.59 0 0 1 0-.443c.002-.076.027-.097.101-.097h.134c.07 0 .087.02.087.09v.25c0 .063-.018.085-.083.085-.164-.001-.328 0-.492-.002-.05-.001-.068.015-.067.066.003.167.002.334 0 .501-.001.05.013.069.064.069.168-.002.336-.001.504-.001.047 0 .067.016.066.063-.003.195-.002.39-.004.584-.001.126-.046.24-.134.331-.115.121-.26.177-.428.172-.144-.004-.276-.052-.387-.148-.073-.063-.12-.143-.142-.237-.011-.048-.002-.07.051-.07h.195c.054 0 .07-.019.07-.071v-.279c0-.054-.018-.074-.072-.074h-.478c-.054 0-.074.019-.073.073.002.148.002.296 0 .443-.001.076-.025.097-.1.097h-.134c-.07 0-.087-.02-.087-.09v-.25c0-.063.018-.085.083-.085.164.001.328 0 .492.002.05.001.068-.015.067-.066-.003-.167-.002-.334 0-.501.001-.05-.013-.069-.064-.069-.168.002-.336.001-.504.001-.047 0-.067-.016-.066-.063.003-.195.002-.39.004-.584.001-.126.046-.24.134-.331.115-.121.26-.177.428-.172.147.004.278.053.388.151.068.061.113.139.136.227.013.05.002.077-.053.077h-.195c-.054 0-.07.019-.07.071v.279c0 .054.018.074.072.074h.478zm-8.12.03c-.025 0-.05.001-.076.003-.097.009-.151.065-.155.16-.003.07-.002.14-.005.21-.003.054-.02.07-.074.068a.96.96 0 0 0-.12 0c-.045.002-.062.02-.061.064.002.078.002.155 0 .233-.001.044.015.063.06.063.04-.001.08 0 .12 0 .054.001.071.02.072.074.001.148.001.296 0 .444-.001.048-.019.065-.067.065h-.12c-.05 0-.066.02-.066.068v.232c0 .049.017.068.067.067.04-.001.08 0 .12 0 .052.002.068.02.069.072v.14c0 .142.001.284-.002.426-.002.086-.035.163-.097.226-.106.107-.238.15-.386.13-.114-.016-.21-.063-.282-.152-.046-.057-.07-.125-.07-.199 0-.087-.001-.175.002-.262.001-.043.018-.062.063-.061h.25c.047 0 .066-.017.065-.064v-.252c0-.05-.017-.068-.067-.068h-.475c-.05 0-.068.017-.067.067v.457c0 .183.055.347.175.487.15.175.347.273.582.288.259.016.486-.059.67-.237.166-.162.25-.362.252-.594.002-.146.001-.292 0-.438v-.14c0-.052.017-.073.07-.072.04.001.08 0 .12 0 .048.001.066-.016.065-.063-.002-.08-.002-.159 0-.239.001-.043-.014-.061-.058-.061-.044.001-.087 0-.131 0-.049-.001-.066-.02-.067-.068-.002-.147-.001-.294 0-.44.001-.054.019-.074.074-.073.04.001.08 0 .12 0 .049.001.066-.016.066-.064v-.233c0-.047-.016-.066-.063-.065a1.71 1.71 0 0 0-.12 0c-.054.002-.072-.015-.073-.07-.001-.066 0-.132-.003-.198-.005-.12-.067-.182-.188-.186a.67.67 0 0 0-.1.003zm4.053 0c-.214.01-.356.151-.367.37-.006.12-.005.24-.002.36.002.058-.014.08-.073.079-.044-.002-.088 0-.132 0-.044 0-.063.015-.062.06.002.08.002.16 0 .24 0 .042.014.06.058.06.048-.002.096 0 .143 0 .048.002.066.02.066.067v.588c0 .05-.017.068-.067.068h-.142c-.05 0-.068.017-.068.067v.232c0 .05.017.068.067.067.048-.001.096 0 .143 0 .05.002.067.02.067.07.002.145.002.29 0 .435-.001.058-.02.076-.078.076h-.143c-.055 0-.073.02-.073.074v.275c0 .05.017.068.067.067.183-.003.366-.001.549-.005.117-.002.224-.04.315-.114.125-.102.188-.237.19-.4.002-.117.001-.234 0-.35 0-.05.016-.07.068-.069.047.002.095 0 .142 0 .049.001.068-.017.067-.066v-.24c0-.046-.016-.064-.063-.064h-.143c-.052-.001-.07-.02-.07-.071v-.58c0-.053.017-.074.071-.073.044.001.088 0 .131 0 .049.002.068-.016.067-.065v-.24c0-.047-.016-.065-.063-.064-.048.001-.095 0-.143 0-.048-.001-.066-.019-.065-.066.002-.11-.004-.22.005-.33.014-.166.162-.286.33-.278.082.004.16.03.225.082.02.016.033.014.049-.005l.155-.189c.017-.021.012-.034-.007-.05-.151-.13-.331-.183-.53-.171zm-8.2.005c-.025.001-.05.003-.075.007-.073.01-.132.047-.175.106-.043.06-.048.126-.018.193.03.067.08.114.148.142.044.018.091.028.139.034.065.008.13.011.194.02.05.006.098.018.144.04.03.015.051.04.051.075 0 .035-.022.063-.054.079a.34.34 0 0 1-.108.033c-.13.018-.254.006-.373-.05a.4.4 0 0 1-.107-.074c-.022-.02-.035-.018-.053.003-.054.064-.109.127-.163.191-.02.024-.018.038.007.057.126.098.27.154.43.17.168.016.333.008.492-.05.116-.043.21-.115.26-.233.041-.095.04-.191-.006-.285-.04-.082-.106-.138-.188-.175a.76.76 0 0 0-.213-.066c-.072-.01-.144-.016-.216-.027-.048-.007-.093-.023-.132-.052-.027-.02-.04-.05-.033-.083.006-.034.028-.055.058-.07a.34.34 0 0 1 .118-.035c.12-.016.234 0 .343.051.029.013.054.032.08.05.02.014.033.01.048-.008.052-.063.106-.125.159-.187.024-.028.021-.043-.008-.064-.113-.084-.242-.127-.383-.139a.92.92 0 0 0-.34.022zm14.287 0c-.025.001-.05.003-.075.007-.073.01-.132.047-.175.106-.043.06-.048.126-.018.193.03.067.08.114.148.142.044.018.091.028.139.034.065.008.13.011.194.02.05.006.098.018.144.04.03.015.051.04.051.075 0 .035-.022.063-.054.079a.34.34 0 0 1-.108.033c-.13.018-.254.006-.373-.05a.4.4 0 0 1-.107-.074c-.022-.02-.035-.018-.053.003-.054.064-.109.127-.163.191-.02.024-.018.038.007.057.126.098.27.154.43.17.168.016.333.008.492-.05.116-.043.21-.115.26-.233.041-.095.04-.191-.006-.285-.04-.082-.106-.138-.188-.175a.76.76 0 0 0-.213-.066c-.072-.01-.144-.016-.216-.027-.048-.007-.093-.023-.132-.052-.027-.02-.04-.05-.033-.083.006-.034.028-.055.058-.07a.34.34 0 0 1 .118-.035c.12-.016.234 0 .343.051.029.013.054.032.08.05.02.014.033.01.048-.008.052-.063.106-.125.159-.187.024-.028.021-.043-.008-.064-.113-.084-.242-.127-.383-.139a.92.92 0 0 0-.34.022zM4.227.12c-.006 0-.012.002-.018.006-.017.01-.017.029-.017.047v1.79c0 .021 0 .042.022.051.02.01.037-.003.052-.016l.78-.677a.05.05 0 0 1 .063 0l.78.677c.015.013.032.026.052.016.022-.01.022-.03.022-.051V.173c0-.018 0-.037-.017-.047-.018-.01-.036-.001-.052.012l-.785.682a.05.05 0 0 1-.063 0L4.28.138c-.016-.013-.034-.022-.052-.012v-.005zm6.34.007c-.02.003-.04.012-.056.03L9.427 1.35c-.034.04-.032.09.007.125.04.036.09.033.127-.007L10.5.381l.938 1.086c.037.04.088.043.127.007.04-.035.041-.085.007-.125L10.488.157c-.035-.04-.1-.05-.143-.03h.222zm5.478.004c-.026.004-.052.018-.072.043l-.945 1.193c-.03.038-.027.087.007.12.037.035.087.033.12-.007l.89-1.123.89 1.123c.033.04.083.042.12.007.034-.033.037-.082.007-.12L16.117.173c-.033-.041-.09-.055-.132-.043h.06zm-8.072.78c-.175.002-.35.001-.524.001-.05 0-.069.017-.068.067.002.147.002.295 0 .442-.001.05.017.07.068.068.044-.002.088 0 .131 0 .049.001.068.02.068.069v.57c0 .053-.018.073-.072.072-.043-.002-.087 0-.13 0-.05-.001-.07.017-.069.068.003.077.003.154 0 .232-.002.049.016.069.066.068.175-.002.35-.001.525-.001.05 0 .069-.017.068-.068-.002-.077-.002-.154 0-.231.001-.052-.017-.07-.07-.069-.043.002-.087 0-.13 0-.054.001-.073-.018-.073-.072v-.568c0-.05.018-.069.07-.069.043-.001.087 0 .13 0 .054.001.072-.018.072-.072-.002-.146-.002-.293 0-.44.001-.052-.017-.07-.07-.069-.044.001-.087 0-.131 0-.05-.001-.069-.019-.069-.069h.108z"/>
    </svg>
  ),
  'max': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M2.4 0A2.4 2.4 0 0 0 0 2.4v19.2A2.4 2.4 0 0 0 2.4 24h19.2a2.4 2.4 0 0 0 2.4-2.4V2.4A2.4 2.4 0 0 0 21.6 0Zm5.075 7.128h2.326l1.544 3.907 1.547-3.907h2.326v9.744h-2.119V11.58l-1.26 3.107h-1.025l-1.26-3.107v5.292H7.475Zm10.05 0h2.3l2.175 9.744h-2.275l-.325-1.671h-1.75l-.325 1.671h-2.275ZM18 9.414l-.55 3.399h1.1Z"/>
    </svg>
  ),
};

// Fallback emoji icons
const getServiceIcon = (name: string): string => {
  const key = name.toLowerCase();
  if (key.includes('netflix')) return '🔴';
  if (key.includes('amazon') || key.includes('prime')) return '🔵';
  if (key.includes('disney')) return '🏰';
  if (key.includes('hulu')) return '🟢';
  if (key.includes('max') || key.includes('hbo')) return '🟣';
  if (key.includes('apple')) return '🍎';
  if (key.includes('peacock')) return '🦚';
  if (key.includes('paramount')) return '⛰️';
  if (key.includes('youtube')) return '▶️';
  if (key.includes('tubi')) return '📺';
  if (key.includes('pluto')) return '📡';
  if (key.includes('vudu') || key.includes('fandango')) return '💚';
  if (key.includes('google')) return '🎮';
  if (key.includes('itunes')) return '🎵';
  if (key.includes('crunchyroll')) return '🍊';
  if (key.includes('shudder')) return '👻';
  if (key.includes('freevee')) return '🆓';
  return '📺';
};

const getServiceColor = (name: string): string => {
  const key = name.toLowerCase();
  return SERVICE_COLORS[key] || '#666666';
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'subscription': return 'Stream';
    case 'rent': return 'Rent';
    case 'buy': return 'Buy';
    case 'free': return 'Free';
    default: return 'Watch';
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'subscription': return 'bg-green-500/20 text-green-400';
    case 'rent': return 'bg-blue-500/20 text-blue-400';
    case 'buy': return 'bg-purple-500/20 text-purple-400';
    case 'free': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export default function StreamingButtons({ providers, loading, onRefresh, justWatchUrl }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>Finding where to watch...</span>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          No streaming options found. This title may not be available for streaming.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-sm text-primary hover:underline self-start"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  // Group by type
  const subscriptionProviders = providers.filter(p => p.type === 'subscription');
  const freeProviders = providers.filter(p => p.type === 'free');
  const rentProviders = providers.filter(p => p.type === 'rent');
  const buyProviders = providers.filter(p => p.type === 'buy');

  const renderProviderButton = (provider: StreamingProvider, index: number) => {
    const color = getServiceColor(provider.name);
    const icon = getServiceIcon(provider.name);
    // Use provider's direct URL, fallback to JustWatch, then fallback to #
    const linkUrl = provider.url || justWatchUrl || '#';
    
    return (
      <motion.a
        key={`${provider.name}-${provider.provider_id}-${index}`}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
        style={{ backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {/* TMDB logo or emoji fallback */}
        {provider.logo_url ? (
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white/10">
            <Image
              src={provider.logo_url}
              alt={provider.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <span className="text-xl">{icon}</span>
        )}
        <div className="flex-1">
          <span className="font-medium">{provider.name}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(provider.type)}`}>
          {getTypeLabel(provider.type)}
        </span>
      </motion.a>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Subscription Services */}
      {subscriptionProviders.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
            <span className="text-green-400">●</span> Included with subscription
          </h4>
          <div className="grid gap-2">
            {subscriptionProviders.map((p, i) => renderProviderButton(p, i))}
          </div>
        </div>
      )}

      {/* Free Services */}
      {freeProviders.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
            <span className="text-yellow-400">●</span> Free with ads
          </h4>
          <div className="grid gap-2">
            {freeProviders.map((p, i) => renderProviderButton(p, subscriptionProviders.length + i))}
          </div>
        </div>
      )}

      {/* Rent/Buy */}
      {(rentProviders.length > 0 || buyProviders.length > 0) && (
        <div>
          <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
            <span className="text-blue-400">●</span> Rent or Buy
          </h4>
          <div className="grid gap-2">
            {rentProviders.map((p, i) => renderProviderButton(p, subscriptionProviders.length + freeProviders.length + i))}
            {buyProviders.map((p, i) => renderProviderButton(p, subscriptionProviders.length + freeProviders.length + rentProviders.length + i))}
          </div>
        </div>
      )}

      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="text-xs text-muted hover:text-primary transition-colors self-end flex items-center gap-1 mt-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh availability
        </button>
      )}

      {/* JustWatch Attribution */}
      {justWatchUrl && (
        <a
          href={justWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted hover:text-white transition-colors self-center mt-2 flex items-center gap-1"
        >
          <span>Streaming data from</span>
          <span className="text-yellow-500 font-semibold">JustWatch</span>
        </a>
      )}
    </div>
  );
}
