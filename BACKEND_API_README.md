# Anon Reader - Backend API Documentation

## Overview
This document outlines the required backend API endpoints and data structures for the Anon Reader application. The frontend is built with Next.js 15 using TypeScript and implements a comic/story reading platform with personalized recommendations, user authentication, and story creation tools.

## Technology Stack
- **Authentication**: Google OAuth 2.0 via NextAuth.js
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Expected Backend**: RESTful API with JSON responses
- **Database**: Expected to support relational data with proper indexing

## Core Data Models

### User
```typescript
interface User {
  id: string;                    // Unique user identifier
  email: string;                 // User's email from OAuth
  name: string;                  // Display name
  persona: UserPersona;          // User's reading preferences
  favorites: string[];           // Array of comic IDs
  history: ReadingHistory[];     // Reading progress tracking
  createdAt: string;            // ISO 8601 timestamp
}

interface UserPersona {
  storyEndingPreference: "Love wins" | "Justice served" | "Bittersweet" | "Open-ended";
  justiceOrMercy: "Justice" | "Mercy";
  planOrMess: "Perfect Plan" | "Glorious Mess";
  riskOrFaith: "Calculated Risk" | "Leap of Faith";
  twistOrPayoff: "Shocking Twist" | "Satisfying Payoff";
  hopeOrHonesty: "Unshakeable Hope" | "Brutal Honesty";
  greaterGoodOrPersonalBond: "Greater Good" | "Personal Bond";
  vibes: Array<"Cozy & Heartwarming" | "Dark & Brooding" | "Witty & Charming" | "Action-Packed & Thrilling">;
  favoriteTwist: "Identity reveal" | "Hidden betrayal" | "Time manipulation" | "Unreliable narrator";
  personaType: string;          // Generated personality type based on preferences
}

interface ReadingHistory {
  comicId: string;
  lastReadPage: number;
  lastReadAt: string;           // ISO 8601 timestamp
  progress: number;             // Percentage (0-100)
}
```

### Comic/Story
```typescript
interface Comic {
  id: string;
  title: string;
  description: string;
  posterImage: string;          // URL to cover image
  categories: string[];         // Genre tags
  type: "text" | "image";       // Story format
  releaseDate: string;          // ISO 8601 timestamp
  popularity: number;           // Engagement score (0-100)
  rating: number;              // Average rating (0-5)
  pages?: ComicPage[];         // For image-based comics
  textContent?: TextChapter[]; // For text-based stories
}

interface ComicPage {
  id: number;
  imageUrl: string;            // URL to page image
}

interface TextChapter {
  id: number;
  title: string;
  content: string;             // Full chapter text
  audioUrl?: string;           // Optional audio narration
}
```

### Story Creation (Producer Tools)
```typescript
interface StoryDraft {
  id: string;
  userId: string;              // Creator's user ID
  title: string;
  description: string;
  plot: string;                // Main story content
  characters: Character[];
  posterImage?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;           // Generated or uploaded character image
  role: "protagonist" | "antagonist" | "supporting" | "background";
}

interface PublishedStory {
  id: string;
  userId: string;
  title: string;
  description: string;
  posterImage: string;
  categories: string[];
  content: string;             // Full story content
  characters: Character[];
  publishedAt: string;
  popularity: number;
  rating: number;
  totalReads: number;
}
```

## Required API Endpoints

### Authentication Endpoints
These endpoints should integrate with Google OAuth flow initiated by NextAuth.js:

#### `POST /api/auth/google/callback`
Handle Google OAuth callback and create/update user session.

**Request Body:**
```json
{
  "accessToken": "string",
  "idToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "image": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": User,
  "sessionToken": "string"
}
```

#### `POST /api/auth/logout`
Invalidate user session.

**Headers:** `Authorization: Bearer {sessionToken}`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Management Endpoints

#### `GET /api/users/me`
Get current user profile and preferences.

**Headers:** `Authorization: Bearer {sessionToken}`

**Response:**
```json
{
  "success": true,
  "user": User
}
```

#### `PUT /api/users/me`
Update user profile or preferences.

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "name"?: "string",
  "persona"?: UserPersona
}
```

**Response:**
```json
{
  "success": true,
  "user": User
}
```

#### `POST /api/users/onboarding`
Complete user onboarding with personality assessment.

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "persona": UserPersona
}
```

**Response:**
```json
{
  "success": true,
  "user": User,
  "recommendations": Comic[]
}
```

#### `POST /api/users/favorites/{comicId}`
Add comic to user's favorites.

**Headers:** `Authorization: Bearer {sessionToken}`

**Response:**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

#### `DELETE /api/users/favorites/{comicId}`
Remove comic from user's favorites.

**Headers:** `Authorization: Bearer {sessionToken}`

**Response:**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

#### `POST /api/users/history`
Update reading progress.

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "comicId": "string",
  "pageNumber": "number",
  "progress": "number"
}
```

**Response:**
```json
{
  "success": true,
  "history": ReadingHistory
}
```

### Content Discovery Endpoints

#### `GET /api/comics`
Get comics with filtering and pagination.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `category`: string (optional filter)
- `type`: "text" | "image" (optional filter)
- `sort`: "popularity" | "rating" | "recent" | "trending" (default: "popularity")
- `search`: string (optional search term)

**Response:**
```json
{
  "success": true,
  "comics": Comic[],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

#### `GET /api/comics/{id}`
Get specific comic details.

**Response:**
```json
{
  "success": true,
  "comic": Comic
}
```

#### `GET /api/comics/trending`
Get trending comics (last 7 days activity).

**Query Parameters:**
- `limit`: number (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "comics": Comic[]
}
```

#### `GET /api/comics/recommendations`
Get personalized recommendations for authenticated user.

**Headers:** `Authorization: Bearer {sessionToken}`

**Query Parameters:**
- `limit`: number (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "recommendations": Comic[],
  "reason": "string"  // Why these were recommended
}
```

### Story Creation Endpoints (Producer Tools)

#### `GET /api/stories/drafts`
Get user's story drafts.

**Headers:** `Authorization: Bearer {sessionToken}`

**Response:**
```json
{
  "success": true,
  "drafts": StoryDraft[]
}
```

#### `POST /api/stories/drafts`
Create new story draft.

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "plot": "string",
  "characters": Character[]
}
```

**Response:**
```json
{
  "success": true,
  "draft": StoryDraft
}
```

#### `PUT /api/stories/drafts/{id}`
Update story draft (auto-save functionality).

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "title"?: "string",
  "description"?: "string",
  "plot"?: "string",
  "characters"?: Character[],
  "posterImage"?: "string"
}
```

**Response:**
```json
{
  "success": true,
  "draft": StoryDraft
}
```

#### `DELETE /api/stories/drafts/{id}`
Delete story draft.

**Headers:** `Authorization: Bearer {sessionToken}`

**Response:**
```json
{
  "success": true,
  "message": "Draft deleted"
}
```

#### `POST /api/stories/publish/{draftId}`
Publish story from draft.

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "categories": "string[]"
}
```

**Response:**
```json
{
  "success": true,
  "story": PublishedStory
}
```

#### `GET /api/stories/published`
Get user's published stories.

**Headers:** `Authorization: Bearer {sessionToken}`

**Response:**
```json
{
  "success": true,
  "stories": PublishedStory[]
}
```

### Character Generation Endpoints

#### `POST /api/characters/generate-image`
Generate character image based on description.

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "description": "string",
  "style": "realistic" | "anime" | "cartoon" | "sketch"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "string",
  "generationId": "string"
}
```

### Analytics Endpoints (Optional)

#### `POST /api/analytics/reading`
Track reading events for recommendations.

**Headers:** `Authorization: Bearer {sessionToken}`

**Request Body:**
```json
{
  "comicId": "string",
  "event": "start" | "page_turn" | "complete" | "bookmark",
  "pageNumber"?: "number",
  "timeSpent"?: "number"  // seconds
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event tracked"
}
```

## Error Response Format

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "string",        // ERROR_CODE for programmatic handling
    "message": "string",     // Human-readable error message
    "details"?: "any"        // Optional additional error context
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Database Considerations

### Required Tables/Collections
1. **users** - User profiles and preferences
2. **comics** - Published comics/stories
3. **story_drafts** - Unpublished user stories
4. **characters** - Character definitions
5. **reading_history** - User reading progress
6. **user_favorites** - User favorite comics
7. **analytics_events** - Reading behavior tracking (optional)

### Recommended Indexes
- `users.email` (unique)
- `comics.categories` (array index)
- `comics.popularity` (descending)
- `comics.rating` (descending)
- `comics.releaseDate` (descending)
- `reading_history.userId` + `reading_history.lastReadAt`
- `story_drafts.userId` + `story_drafts.updatedAt`

### File Storage
The application expects file upload capabilities for:
- User-generated character images
- Story poster images
- Comic page images
- Audio files for text narration

Recommend using cloud storage (AWS S3, Google Cloud Storage, etc.) with CDN for optimal performance.

## Authentication Flow

1. User clicks "Sign in with Google" on frontend
2. NextAuth.js handles OAuth flow with Google
3. On successful authentication, NextAuth calls your backend `/api/auth/google/callback`
4. Backend creates/updates user record and returns session token
5. Frontend stores session token for subsequent API calls
6. All protected endpoints verify session token in Authorization header

## Rate Limiting Recommendations

- **Authentication endpoints**: 5 requests/minute per IP
- **Content browsing**: 100 requests/minute per user
- **Story creation**: 30 requests/minute per user
- **File uploads**: 10 requests/minute per user

## Content Moderation

Consider implementing content moderation for user-generated stories:
- Automated content filtering for inappropriate material
- User reporting system
- Admin review workflow for published stories

## Performance Considerations

- Implement caching for popular comics and recommendations
- Use pagination for large data sets
- Optimize image delivery with multiple sizes/formats
- Consider implementing read-through cache for user data
- Background processing for recommendation algorithm updates

This API specification provides the foundation for a fully functional comic reading platform with personalized recommendations and story creation tools.
