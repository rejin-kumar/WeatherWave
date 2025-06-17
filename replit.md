# Weather App - System Architecture

## Overview

This is a full-stack weather application built with React on the frontend and Express.js on the backend. The app provides real-time weather data, forecasts, and location-based weather services with a modern, responsive UI built using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Animations**: Framer Motion for smooth animations and transitions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Development**: TSX for TypeScript execution in development
- **Build**: ESBuild for production bundling
- **API Integration**: OpenWeatherMap API for weather data

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **Schema**: Weather data storage with location coordinates and weather metrics
- **Migrations**: Drizzle Kit for schema migrations

## Key Components

### Frontend Components
- **Weather Display**: Current weather card with animated weather icons
- **Forecasts**: Hourly and weekly weather forecast components
- **Location Services**: Geolocation API integration with fallback to manual search
- **UI Components**: Complete shadcn/ui component library for consistent design
- **Particle Effects**: Weather-based particle animations for visual enhancement

### Backend Services
- **Weather API**: RESTful endpoints for current weather and forecasts
- **Location Search**: City/location search functionality
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **CORS**: Cross-origin request handling for frontend-backend communication

### Shared Schema
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Validation**: Zod schemas for runtime type checking
- **Database Models**: Drizzle schema definitions for weather data

## Data Flow

1. **User Location**: App requests geolocation permission or allows manual location search
2. **Weather Fetching**: Backend calls OpenWeatherMap API with coordinates
3. **Data Processing**: Weather data is formatted and optionally stored in database
4. **Frontend Display**: React Query manages caching and displays weather information
5. **Real-time Updates**: Periodic refetching keeps weather data current

## External Dependencies

### APIs
- **OpenWeatherMap**: Primary weather data provider (requires API key)
- **Geolocation API**: Browser's native geolocation for user position

### Key Libraries
- **UI**: @radix-ui components, framer-motion, tailwindcss
- **Data**: @tanstack/react-query, drizzle-orm, zod
- **Development**: vite, typescript, tsx, esbuild
- **Database**: @neondatabase/serverless, drizzle-kit

### Development Tools
- **Replit Integration**: Custom Replit plugins for development environment
- **Hot Reload**: Vite HMR for fast development cycles
- **Type Checking**: TypeScript strict mode for type safety

## Deployment Strategy

### Development
- **Command**: `npm run dev` starts both frontend and backend in development mode
- **Port**: Application runs on port 5000
- **Hot Reload**: Vite provides instant updates for frontend changes
- **Database**: Uses PostgreSQL via DATABASE_URL environment variable

### Production
- **Build Process**: 
  1. Frontend built with Vite to `dist/public`
  2. Backend bundled with ESBuild to `dist/index.js`
- **Start Command**: `npm start` runs the production build
- **Static Files**: Express serves built frontend files
- **Environment**: Requires OPENWEATHER_API_KEY and DATABASE_URL

### Replit Configuration
- **Autoscale Deployment**: Configured for automatic scaling
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Modules**: nodejs-20, web, postgresql-16 for complete runtime environment

## Changelog

Changelog:
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.