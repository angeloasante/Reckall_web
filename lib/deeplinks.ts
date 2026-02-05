// Deep linking utilities for streaming services and video platforms

export interface DeepLinkResult {
  url: string;
  appUrl?: string;
  label: string;
}

// YouTube deep links
export function getYouTubeTrailerLink(title: string, year?: number | null): DeepLinkResult {
  const query = encodeURIComponent(`${title} ${year || ''} official trailer`);
  return {
    url: `https://www.youtube.com/results?search_query=${query}`,
    appUrl: `youtube://results?search_query=${query}`,
    label: 'Watch Trailer',
  };
}

// JustWatch - aggregates streaming availability
export function getJustWatchLink(title: string): DeepLinkResult {
  const query = encodeURIComponent(title);
  return {
    url: `https://www.justwatch.com/us/search?q=${query}`,
    label: 'Where to Watch',
  };
}

// Netflix deep links
export function getNetflixLink(title: string, netflixId?: string): DeepLinkResult {
  if (netflixId) {
    return {
      url: `https://www.netflix.com/title/${netflixId}`,
      appUrl: `nflx://www.netflix.com/title/${netflixId}`,
      label: 'Netflix',
    };
  }
  const query = encodeURIComponent(title);
  return {
    url: `https://www.netflix.com/search?q=${query}`,
    appUrl: `nflx://www.netflix.com/search?q=${query}`,
    label: 'Netflix',
  };
}

// Amazon Prime Video deep links
export function getPrimeVideoLink(title: string): DeepLinkResult {
  const query = encodeURIComponent(title);
  return {
    url: `https://www.amazon.com/s?k=${query}&i=instant-video`,
    appUrl: `aiv://aiv/search?phrase=${query}`,
    label: 'Prime Video',
  };
}

// Disney+ deep links
export function getDisneyPlusLink(title: string): DeepLinkResult {
  const query = encodeURIComponent(title);
  return {
    url: `https://www.disneyplus.com/search?q=${query}`,
    appUrl: `disneyplus://search?q=${query}`,
    label: 'Disney+',
  };
}

// HBO Max deep links
export function getHBOMaxLink(title: string): DeepLinkResult {
  const query = encodeURIComponent(title);
  return {
    url: `https://www.max.com/search?q=${query}`,
    label: 'Max',
  };
}

// Apple TV+ deep links
export function getAppleTVLink(title: string): DeepLinkResult {
  const query = encodeURIComponent(title);
  return {
    url: `https://tv.apple.com/search?term=${query}`,
    appUrl: `com.apple.tv://search?term=${query}`,
    label: 'Apple TV+',
  };
}

// Hulu deep links
export function getHuluLink(title: string): DeepLinkResult {
  const query = encodeURIComponent(title);
  return {
    url: `https://www.hulu.com/search?q=${query}`,
    label: 'Hulu',
  };
}

// IMDb deep link
export function getIMDbLink(imdbId: string): DeepLinkResult {
  return {
    url: `https://www.imdb.com/title/${imdbId}`,
    appUrl: `imdb:///title/${imdbId}`,
    label: 'IMDb',
  };
}

// Attempt to open app first, fallback to web
export function openDeepLink(link: DeepLinkResult): void {
  if (link.appUrl && typeof window !== 'undefined') {
    // Try app first on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = link.appUrl;
      // Fallback to web after delay if app doesn't open
      setTimeout(() => {
        window.open(link.url, '_blank');
      }, 500);
      return;
    }
  }
  window.open(link.url, '_blank');
}
