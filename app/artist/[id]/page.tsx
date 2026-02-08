import { Metadata } from 'next';
import ArtistDetailClient from './ArtistDetailClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reckallbackend-production.up.railway.app/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArtist(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch artist:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getArtist(id);
  
  if (!data?.artist) {
    return {
      title: 'Artist Not Found | Reckall',
    };
  }

  const artist = data.artist;
  const description = artist.biography 
    ? artist.biography.substring(0, 160) + '...'
    : `${artist.name} - ${artist.known_for_department || 'Actor'}. View filmography and details on Reckall.`;

  return {
    title: `${artist.name} | Reckall`,
    description,
    openGraph: {
      title: `${artist.name} | Reckall`,
      description,
      images: artist.profile_url ? [artist.profile_url.replace('/w185', '/h632')] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} | Reckall`,
      description,
      images: artist.profile_url ? [artist.profile_url.replace('/w185', '/h632')] : [],
    },
  };
}

export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params;
  return <ArtistDetailClient artistId={id} />;
}
