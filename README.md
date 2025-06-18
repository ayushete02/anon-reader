# Comic Reader App

A Next.js application for reading digital comics with personalized recommendations based on user preferences.

## Features

### Implemented
- **Landing page** with login functionality
- **User authentication** (mock implementation using localStorage)
- **Onboarding flow** to build user personas through questions
- **Browse page** with personalized comic recommendations
- **Comic detail pages** with descriptions and reader functionality
- **Comic viewer** with support for audio and images
- **User profile page** showing reading history and favorites
- **Favorites system** to bookmark comics
- **Continue reading** functionality to save and resume progress

### Pending for Future Implementation
- **Real data fetching** from a backend API instead of mock data
- **Enhanced audio playback** with more control options and visualization
- **Responsive design improvements** for mobile devices
- **Social features** like sharing and commenting
- **Advanced recommendations** using machine learning algorithms
- **User account management** features

## Tech Stack
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS for styling
- Context API for state management

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Account
- Email: demo@example.com
- Password: any (mock authentication accepts any password)

## Structure
- `/src/app` - Next.js app routes and pages
- `/src/components` - Reusable UI components
- `/src/context` - React context for state management
- `/src/lib` - Utility functions, types, and mock data
- `/public` - Static assets like images and audio files
