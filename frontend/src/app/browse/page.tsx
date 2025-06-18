"use client";

import React, { useState, useEffect } from "react";
import { MOCK_COMICS } from "@/lib/mock-data";
import { Comic, UserPersona } from "@/lib/types";
import { filterComicsByPersona } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ComicRow from "@/components/ComicRow";

const BrowsePage = () => {
  const [comics, setComics] = useState<Comic[]>(MOCK_COMICS);
  const [userPersona, setUserPersona] = useState<Partial<UserPersona>>({});
  const [loading, setLoading] = useState(true);
  const [personaLoaded, setPersonaLoaded] = useState(false);

  // Get featured comic (highest rated one)
  const featuredComic = comics.sort((a, b) => b.rating - a.rating)[0];

  // Load user persona from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPersona = localStorage.getItem("userPersona");
      if (savedPersona) {
        try {
          const persona = JSON.parse(savedPersona);
          setUserPersona(persona);
          setPersonaLoaded(true);
        } catch (error) {
          console.error("Error parsing user persona:", error);
        }
      }

      setLoading(false);
    }
  }, []);

  // Filter comics when persona is loaded
  useEffect(() => {
    if (personaLoaded && Object.keys(userPersona).length > 0) {
      const filteredComics = filterComicsByPersona(
        MOCK_COMICS,
        userPersona as UserPersona
      );
      setComics(filteredComics);
    }
  }, [personaLoaded, userPersona]);

  // Group comics by category
  const getComicsByCategory = (category: string) => {
    return comics.filter((comic) => comic.categories.includes(category));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      {featuredComic && <HeroBanner comic={featuredComic} />}

      <main className="max-w-7xl mx-auto px-4 pt-8 pb-20">
        {/* Personalized Recommendations */}
        {personaLoaded && (
          <ComicRow
            title={`Top Picks for ${userPersona.personaType || "You"}`}
            comics={comics.slice(0, 6)}
          />
        )}

        {/* Categories */}
        <ComicRow
          title="Epic & Grandiose"
          comics={getComicsByCategory("Epic & Grandiose")}
        />

        <ComicRow
          title="Mind-Bending & Mysterious"
          comics={getComicsByCategory("Mind-Bending & Mysterious")}
        />

        <ComicRow
          title="Action-Packed & Thrilling"
          comics={getComicsByCategory("Action-Packed & Thrilling")}
        />

        <ComicRow
          title="Witty & Charming"
          comics={getComicsByCategory("Witty & Charming")}
        />
      </main>
    </div>
  );
};

export default BrowsePage;
