# Reckall Web

**Reckall — Shazam for Movies**

Reckall is an AI-powered movie identification platform that lets users upload video clips and instantly identify movies using advanced AI recognition technology. This repository contains the web application built with Next.js 14.

## 🎬 Features

- **Instant Movie Recognition** - Upload any video clip and let AI identify the movie in seconds
- **AI-Powered Analysis** - Analyzes dialogue, recognizes actors, and processes visual scenes
- **Movie Details** - View comprehensive movie information including cast, overview, and similar recommendations
- **Where to Watch** - Real streaming URLs via JustWatch GraphQL API (Netflix, Disney+, Amazon Prime, Apple TV+, etc.)
- **Streaming Buttons** - Horizontal scroll pill-shaped buttons with brand colors and platform logos
- **YouTube Trailers** - Watch official trailers directly in the app
- **Recently Identified** - Browse movies discovered by the Reckall community
- **Responsive Design** - Beautiful, modern UI that works on all devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Supabase](https://supabase.com/)
- **Streaming Data**: [JustWatch GraphQL API](https://www.justwatch.com/)
- **Movie Data**: [TMDB API](https://www.themoviedb.org/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📁 Project Structure

```
web/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── not-found.tsx        # Custom 404 page
│   └── movie/[id]/          # Movie detail pages
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   └── StreamingButtons.tsx # Streaming service pills with brand colors
├── lib/
│   └── api.ts               # API utilities & types
└── public/
    ├── logo.png             # Reckall logo
    └── favicon.ico          # Site favicon
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### Installation

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages

- **Homepage** (`/`) - Hero, How It Works, Recently Identified
- **Movie Detail** (`/movie/[id]`) - Full movie info, cast, similar movies
- **404 Page** - Custom "Scene Not Found" error page

## 🎨 Design System

- **Primary**: Indigo to Orange gradient
- **Background**: Dark (`#0a0e14`)
- **Glass Effect**: Frosted glass UI elements
- **Movie Cards**: Hover animations

## 👤 Author

**Travis Moore**

## 📄 License

Proprietary software. All rights reserved.

---

© 2026 Reckall. All rights reserved.
