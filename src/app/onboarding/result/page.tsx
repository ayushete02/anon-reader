"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPersona } from "@/lib/types";
import AuthGuard from "@/components/AuthGuard";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-secondary dark:text-white font-medium">
          Creating your unique profile...
        </p>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-secondary rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col px-8 py-10 relative items-center">
          {/* Logo or Brand */}
          <div className="mb-6">
            <div className="text-2xl font-bold text-primary">Anon Reader</div>
          </div>

          {/* Persona Type Pill */}
          <span className="inline-block bg-primary text-white text-base font-medium py-2 px-6 rounded-full mb-6">
            {persona.personaType || "Your Persona"}
          </span>

          {/* Main Text */}
          <h1 className="text-2xl font-bold text-secondary dark:text-white text-center mb-4 leading-tight">
            You&apos;re a{" "}
            {persona.personaType ? (
              <span className="text-primary">{persona.personaType}</span>
            ) : (
              "unique reader"
            )}
            !
          </h1>

          <p className="text-base text-gray-600 dark:text-gray-300 text-center mb-8">
            {getPersonaDescription(persona.personaType || "")}
          </p>

          {/* Explore Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-soft hover:shadow-hover flex items-center justify-center gap-2"
          >
            <span>Explore Stories</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Additional info */}
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            Your preferences have been saved and will be used to recommend
            stories
          </p>
        </div>
      </div>
    </AuthGuard>
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
