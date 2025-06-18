"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/lib/types";
import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
  clearUserFromLocalStorage,
} from "@/lib/utils";

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

// Create context with default value
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Login function to set user in state and localStorage
  const login = (userData: User) => {
    setUser(userData);
    saveUserToLocalStorage(userData);
  };

  // Logout function to clear user from state and localStorage
  const logout = () => {
    setUser(null);
    clearUserFromLocalStorage();
  };

  // Update user data (for updating profile, preferences, etc.)
  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;

    const newUserData = {
      ...user,
      ...updatedUser,
    };

    setUser(newUserData);
    saveUserToLocalStorage(newUserData);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
