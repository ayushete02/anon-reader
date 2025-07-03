import { Comic, User } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    email: "demo@example.com",
    name: "Demo User",
    persona: {
      storyEndingPreference: "Love wins",
      justiceOrMercy: "Mercy",
      planOrMess: "Glorious Mess",
      riskOrFaith: "Leap of Faith",
      twistOrPayoff: "Satisfying Payoff",
      hopeOrHonesty: "Unshakeable Hope",
      greaterGoodOrPersonalBond: "Personal Bond",
      vibes: ["Cozy & Heartwarming", "Witty & Charming"],
      favoriteTwist: "Identity reveal",
      personaType: "The Dreamer",
    },
    favorites: ["1", "3"],
    history: [
      {
        comicId: "1",
        lastReadPage: 3,
        lastReadAt: "2025-06-17T14:30:00Z",
        progress: 30,
      },
      {
        comicId: "2",
        lastReadPage: 1,
        lastReadAt: "2025-06-16T09:15:00Z",
        progress: 10,
      },
    ],
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "u2",
    email: "user@test.com",
    name: "Test User",
    persona: {
      storyEndingPreference: "Justice served",
      justiceOrMercy: "Justice",
      planOrMess: "Perfect Plan",
      riskOrFaith: "Calculated Risk",
      twistOrPayoff: "Shocking Twist",
      hopeOrHonesty: "Brutal Honesty",
      greaterGoodOrPersonalBond: "Greater Good",
      vibes: ["Dark & Brooding", "Action-Packed & Thrilling"],
      favoriteTwist: "Hidden betrayal",
      personaType: "The Strategist",
    },
    favorites: ["2", "4"],
    history: [
      {
        comicId: "4",
        lastReadPage: 5,
        lastReadAt: "2025-06-18T10:45:00Z",
        progress: 50,
      },
    ],
    createdAt: "2025-02-15T00:00:00Z",
  },
];

export const MOCK_COMICS: Comic[] = [];
