export interface Comic {
  id: string;
  title: string;
  description: string;
  posterImage: string;
  categories: string[];
  type: "text" | "image"; // Story type - either text-based or image-based
  releaseDate: string;
  popularity: number;
  rating: number;
  pages?: ComicPage[]; // For image-based stories
  textContent?: TextChapter[]; // For text-based stories
}

export interface ComicPage {
  id: number;
  imageUrl: string;
}

export interface TextChapter {
  id: number;
  title: string;
  paragraphs: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string; // User profile image URL
  persona?: UserPersona;
  preferences?: UserPreferences; // User settings and preferences
  favorites: string[]; // Comic IDs that the user has favorited
  history: ReadingHistory[];
  readingHistory?: ReadingHistory[]; // Alternative name for backwards compatibility
  isProducer?: boolean; // Whether user can create comics
  createdAt: string;
}

export interface ReadingHistory {
  comicId: string;
  lastReadPage: number;
  lastReadAt: string;
  progress: number; // 0-100 percentage
}

export interface UserPreferences {
  theme: "light" | "dark";
  autoplay: boolean;
  notifications: boolean;
}

export interface UserPersona {
  storyEndingPreference: string;
  justiceOrMercy: string;
  planOrMess: string;
  riskOrFaith: string;
  twistOrPayoff: string;
  hopeOrHonesty: string;
  greaterGoodOrPersonalBond: string;
  vibes: string[];
  favoriteTwist: string;
  personaType: string;
}

export const PERSONA_QUESTIONS = {
  welcome: {
    title: "Every story has a twist... but yours will be shaped by you.",
    options: [],
  },
  storyEnding: {
    title: "How should a story end?",
    options: [
      "Love wins",
      "Justice served",
      "Bittersweet",
      "Twist you never saw coming",
    ],
  },
  justiceOrMercy: {
    title: "Justice or Mercy?",
    options: ["Justice", "Mercy"],
  },
  planOrMess: {
    title: "A Perfect Plan or A Glorious Mess?",
    options: ["Perfect Plan", "Glorious Mess"],
  },
  riskOrFaith: {
    title: "A Calculated Risk or A Leap of Faith?",
    options: ["Calculated Risk", "Leap of Faith"],
  },
  twistOrPayoff: {
    title: "A Shocking Twist or A Satisfying Payoff?",
    options: ["Shocking Twist", "Satisfying Payoff"],
  },
  hopeOrHonesty: {
    title: "Unshakeable Hope or Brutal Honesty?",
    options: ["Unshakeable Hope", "Brutal Honesty"],
  },
  greaterGoodOrPersonalBond: {
    title: "The Greater Good or The Personal Bond?",
    options: ["Greater Good", "Personal Bond"],
  },
  vibes: {
    title: "Pick 3-5 vibes you love in a story.",
    options: [
      "Cozy & Heartwarming",
      "Dark & Brooding",
      "Epic & Grandiose",
      "Mind-Bending & Mysterious",
      "Witty & Charming",
      "Tragic & Cathartic",
      "Action-Packed & Thrilling",
    ],
  },
  favoriteTwist: {
    title: "Which twist do you secretly love?",
    options: [
      "Identity reveal",
      "Hidden betrayal",
      "Time/reality bend",
      "Karma hits hard",
    ],
  },
};

// Producer/Story Creation Types
export interface Character {
  id: string;
  name: string;
  description: string;
  type: CharacterType;
  imageUrl?: string;
  isGenerated?: boolean; // Whether the image was AI-generated
}

export type CharacterType =
  | "protagonist"
  | "antagonist"
  | "supporting"
  | "love-interest"
  | "mentor"
  | "comic-relief"
  | "mysterious"
  | "villain";

export interface StoryDraft {
  id?: string;
  title: string;
  description: string;
  plot: string; // Max 2000 words
  type: "text" | "image";
  characters: Character[];
  categories: string[];
  posterImage?: string;
  createdBy: string; // User ID
  status: "draft" | "published" | "generating";
  createdAt: string;
  updatedAt: string;
}

export interface PublishedStory extends Comic {
  createdBy: string;
  publishedAt: string;
}

export const CHARACTER_TYPES: { value: CharacterType; label: string }[] = [
  { value: "protagonist", label: "Protagonist" },
  { value: "antagonist", label: "Antagonist" },
  { value: "supporting", label: "Supporting Character" },
  { value: "love-interest", label: "Love Interest" },
  { value: "mentor", label: "Mentor" },
  { value: "comic-relief", label: "Comic Relief" },
  { value: "mysterious", label: "Mysterious Character" },
  { value: "villain", label: "Villain" },
];

export const STORY_CATEGORIES = [
  "Action-Packed & Thrilling",
  "Cozy & Heartwarming",
  "Dark & Brooding",
  "Epic & Grandiose",
  "Mind-Bending & Mysterious",
  "Witty & Charming",
  "Tragic & Cathartic",
  "Love wins",
  "Justice served",
  "Identity reveal",
  "Hidden betrayal",
  "Time/reality bend",
  "Karma hits hard",
  "Justice",
  "Mercy",
  "Perfect Plan",
  "Glorious Mess",
  "Calculated Risk",
  "Leap of Faith",
  "Shocking Twist",
  "Satisfying Payoff",
  "Unshakeable Hope",
  "Brutal Honesty",
  "Greater Good",
  "Personal Bond",
];

// API Types for Story Generation
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
}

export interface StoryBase {
  title: string;
  description: string;
  type: "text" | "image";
  plot: string;
  categories: string[];
}

export interface StoryCreate extends StoryBase {
  characters: CharacterCreate[];
}

export interface StoryRead extends StoryBase {
  id: string;
  created_at: string;
  updated_at: string;
  generated_story?: string;
  characters: CharacterRead[];
  chapters: ChapterRead[];
}

export interface CharacterBase {
  name: string;
  type: CharacterType;
  description: string;
  image_url?: string | null;
}

export type CharacterCreate = CharacterBase;

export interface CharacterRead extends CharacterBase {
  id: string;
}

export interface ChapterBase {
  title: string;
  content: string;
  chapter_number: number;
  reading_time_seconds: number;
}

export interface ChapterRead extends ChapterBase {
  id: string;
}


export interface Chapter {
  chapter_number: number;
  title: string;
  content: string;
  reading_time_seconds: number;
}
