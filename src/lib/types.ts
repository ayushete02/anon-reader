export interface Comic {
  id: string;
  title: string;
  description: string;
  posterImage: string;
  categories: string[];
  hasAudio: boolean;
  hasImages: boolean;
  releaseDate: string;
  popularity: number;
  rating: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  persona?: UserPersona;
  favorites: string[]; // Comic IDs that the user has favorited
  history: ReadingHistory[];
  createdAt: string;
}

export interface ReadingHistory {
  comicId: string;
  lastReadPage: number;
  lastReadAt: string;
  progress: number; // 0-100 percentage
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
