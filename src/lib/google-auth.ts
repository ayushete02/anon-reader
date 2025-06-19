import { signIn, signOut, getSession } from "next-auth/react";
import { User } from "@/lib/types";
import {
  saveUserToLocalStorage,
  clearUserFromLocalStorage,
  getUserFromLocalStorage,
} from "@/lib/utils";

// Google OAuth login
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/browse",
    });

    if (result?.ok && !result.error) {
      // Wait a moment for the session to be created
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the session to extract user data
      const session = await getSession();

      if (session?.user) {
        // Create a User object from the session data
        const user: User = {
          id: session.user.id || session.user.email || "",
          name: session.user.name || "",
          email: session.user.email || "",
          avatar: session.user.image || "",
          preferences: {
            theme: "dark",
            autoplay: false,
            notifications: true,
          },
          persona: undefined, // Will be set during onboarding
          favorites: [],
          history: [],
          readingHistory: [],
          isProducer: false,
          createdAt: new Date().toISOString(),
        };

        // Save to localStorage for consistency with existing system
        saveUserToLocalStorage(user);
        return user;
      }
    }

    return null;
  } catch (error) {
    console.error("Google sign-in error:", error);
    return null;
  }
};

// Google OAuth logout
export const signOutGoogle = async (): Promise<void> => {
  try {
    await signOut({ redirect: false, callbackUrl: "/" });
    clearUserFromLocalStorage();
  } catch (error) {
    console.error("Google sign-out error:", error);
  }
};

// Check if user is authenticated with Google
export const isGoogleAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await getSession();
    return !!session?.user;
  } catch (error) {
    console.error("Error checking Google authentication:", error);
    return false;
  }
};

// Get current Google user session
export const getCurrentGoogleUser = async (): Promise<User | null> => {
  try {
    const session = await getSession();

    if (session?.user) {
      // First check localStorage for existing user data
      const existingUser = getUserFromLocalStorage();

      if (existingUser && existingUser.email === session.user.email) {
        return existingUser;
      }
      // If not in localStorage, create new user object
      const user: User = {
        id: session.user.id || session.user.email || "",
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
        preferences: {
          theme: "dark",
          autoplay: false,
          notifications: true,
        },
        persona: undefined,
        favorites: [],
        history: [],
        readingHistory: [],
        isProducer: false,
        createdAt: new Date().toISOString(),
      };

      saveUserToLocalStorage(user);
      return user;
    }

    return null;
  } catch (error) {
    console.error("Error getting current Google user:", error);
    return null;
  }
};

// Refresh the Google session
export const refreshGoogleSession = async (): Promise<User | null> => {
  try {
    const session = await getSession();

    if (session?.user) {
      return getCurrentGoogleUser();
    }

    return null;
  } catch (error) {
    console.error("Error refreshing Google session:", error);
    return null;
  }
};
