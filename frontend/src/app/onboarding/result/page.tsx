"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPersona } from "@/lib/types";

const OnboardingResultPage = () => {
  const router = useRouter();
  const [persona, setPersona] = useState<Partial<UserPersona>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPersona = localStorage.getItem("userPersona");
      if (savedPersona) {
        setPersona(JSON.parse(savedPersona));
      }
      setLoading(false);
    }
  }, []);

  const handleContinue = () => {
    router.push("/browse");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Creating your unique profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <span className="inline-block bg-primary text-white text-lg font-bold py-2 px-6 rounded-full mb-2">
            Your Persona
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          You&apos;re a{" "}
          <span className="text-primary">{persona.personaType}</span>
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          {getPersonaDescription(persona.personaType || "")}
        </p>

        <div className="bg-black bg-opacity-30 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Your Story Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-gray-400 mb-1">Favorite ending:</p>
              <p className="font-medium">{persona.storyEndingPreference}</p>
            </div>

            <div>
              <p className="text-gray-400 mb-1">Justice vs Mercy:</p>
              <p className="font-medium">{persona.justiceOrMercy}</p>
            </div>

            <div>
              <p className="text-gray-400 mb-1">Favorite twist:</p>
              <p className="font-medium">{persona.favoriteTwist}</p>
            </div>

            <div>
              <p className="text-gray-400 mb-1">Hope vs Honesty:</p>
              <p className="font-medium">{persona.hopeOrHonesty}</p>
            </div>
          </div>

          <div className="mt-4 text-left">
            <p className="text-gray-400 mb-2">Your vibes:</p>
            <div className="flex flex-wrap gap-2">
              {persona.vibes?.map((vibe) => (
                <span
                  key={vibe}
                  className="bg-gray-800 text-white text-sm py-1 px-3 rounded-full"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="bg-primary text-white py-3 px-8 rounded-full font-bold text-lg hover:bg-red-700 transition-colors"
        >
          Explore Your Comics
        </button>
      </div>
    </div>
  );
};

function getPersonaDescription(personaType: string): string {
  switch (personaType) {
    case "The Romantic Optimist":
      return "You believe in the power of love to overcome all obstacles and always approach stories with hope and optimism.";
    case "The Righteous Judge":
      return "You value justice and fairness above all, and prefer stories where the wicked face consequences for their actions.";
    case "The Melancholic Realist":
      return "You appreciate the bittersweet nature of life and prefer stories that don't shy away from the hard truths.";
    case "The Mystery Seeker":
      return "You love being surprised and challenged by stories that keep you guessing until the very end.";
    case "The Noble Hero":
      return "You believe in sacrifice for the greater good and are drawn to stories of heroism and moral courage.";
    case "The Compassionate Soul":
      return "You value personal connections and mercy, and prefer stories where relationships triumph over rigid principles.";
    case "The Romantic Realist":
      return "You believe in love, but expect pain along the way — you want authentic emotional journeys with hard-earned happy endings.";
    case "The Eclectic Reader":
      return "You have diverse tastes that span many genres and storytelling styles, always open to new experiences.";
    default:
      return "You have a unique perspective on stories that defies simple categorization.";
  }
}

export default OnboardingResultPage;
