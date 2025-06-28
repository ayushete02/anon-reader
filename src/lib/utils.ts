import { Comic, User, UserPersona } from "./types";
import { MOCK_USERS } from "./mock-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Auth Utilities
export const saveUserToLocalStorage = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getUserFromLocalStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
  }
  return null;
};

export const clearUserFromLocalStorage = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  // In a real app, this would make an API call to your backend
  // For the mock version, we'll just check against our mock data

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simple mock authentication that just checks if the email exists
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (user && password) {
    // Added password check to prevent linting error
    // In a real app, you would check the password hash here
    // For the mock version, we'll just accept any non-empty password
    saveUserToLocalStorage(user);
    return user;
  }

  return null;
};

export const logoutUser = (): void => {
  clearUserFromLocalStorage();
};

export function filterComicsByPersona(
  comics: Comic[],
  persona: UserPersona
): Comic[] {
  // Create a scoring system for each comic based on how well it matches the user's persona
  const scoredComics = comics.map((comic) => {
    let score = 0;

    // Match by ending preference
    if (
      (persona.storyEndingPreference === "Love wins" &&
        comic.categories.includes("Love wins")) ||
      (persona.storyEndingPreference === "Justice served" &&
        comic.categories.includes("Justice served")) ||
      (persona.storyEndingPreference === "Bittersweet" &&
        comic.categories.includes("Tragic & Cathartic")) ||
      (persona.storyEndingPreference === "Twist you never saw coming" &&
        comic.categories.some((cat) =>
          [
            "Identity reveal",
            "Hidden betrayal",
            "Time/reality bend",
            "Karma hits hard",
          ].includes(cat)
        ))
    ) {
      score += 3;
    }

    // Match by vibes
    const matchingVibes = comic.categories.filter((category) =>
      persona.vibes.some((vibe) => category.includes(vibe))
    );

    score += matchingVibes.length * 2;

    // Match by favorite twist
    if (comic.categories.includes(persona.favoriteTwist)) {
      score += 3;
    }

    // Match by other preferences (less weight)
    const otherPreferences = [
      persona.justiceOrMercy,
      persona.planOrMess,
      persona.riskOrFaith,
      persona.twistOrPayoff,
      persona.hopeOrHonesty,
      persona.greaterGoodOrPersonalBond,
    ];

    const matchingOtherPrefs = comic.categories.filter((category) =>
      otherPreferences.some((pref) => category.includes(pref))
    );

    score += matchingOtherPrefs.length;

    return { comic, score };
  });

  // Sort by score (highest first) and return the comic objects
  return scoredComics
    .sort((a, b) => b.score - a.score)
    .map((scoredComic) => scoredComic.comic);
}

export function determinePersonaType(persona: Partial<UserPersona>): string {
  const {
    storyEndingPreference,
    justiceOrMercy,
    hopeOrHonesty,
    greaterGoodOrPersonalBond,
    twistOrPayoff,
  } = persona;

  if (
    storyEndingPreference === "Love wins" &&
    hopeOrHonesty === "Unshakeable Hope"
  ) {
    return "The Romantic Optimist";
  } else if (
    storyEndingPreference === "Justice served" &&
    justiceOrMercy === "Justice"
  ) {
    return "The Righteous Judge";
  } else if (
    storyEndingPreference === "Bittersweet" &&
    hopeOrHonesty === "Brutal Honesty"
  ) {
    return "The Melancholic Realist";
  } else if (
    storyEndingPreference === "Twist you never saw coming" &&
    twistOrPayoff === "Shocking Twist"
  ) {
    return "The Mystery Seeker";
  } else if (
    greaterGoodOrPersonalBond === "Greater Good" &&
    justiceOrMercy === "Justice"
  ) {
    return "The Noble Hero";
  } else if (
    greaterGoodOrPersonalBond === "Personal Bond" &&
    justiceOrMercy === "Mercy"
  ) {
    return "The Compassionate Soul";
  } else if (
    storyEndingPreference === "Love wins" &&
    hopeOrHonesty === "Brutal Honesty"
  ) {
    return "The Romantic Realist";
  } else {
    return "The Eclectic Reader";
  }
}
