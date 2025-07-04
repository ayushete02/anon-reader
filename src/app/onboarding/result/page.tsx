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
      <div className="min-h-screen bg-morphic-dark flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-white font-medium">
          Creating your unique profile...
        </p>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="text-white min-h-screen w-full flex flex-col items-center justify-center bg-morphic-dark relative px-4 py-8 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />

        <div className="w-full max-w-md bg-morphic-gray/50 backdrop-blur-xl rounded-3xl border border-white/5 p-8 flex flex-col relative z-10 items-center">
          {/* Logo or Brand */}
          <div className="mb-6">
            <div className="text-2xl font-bold text-primary">Anon Reader</div>
          </div>

          {/* Persona Type Pill */}
          <span className="inline-block bg-primary/20 border border-primary/30 text-white text-base font-medium py-2 px-6 rounded-full mb-6 backdrop-blur-sm">
            {persona.personaType || "Your Persona"}
          </span>

          {/* Main Text */}
          <h1 className="text-2xl font-bold text-white text-center mb-4 leading-tight">
            You&apos;re a{" "}
            {persona.personaType ? (
              <span className="text-primary">{persona.personaType}</span>
            ) : (
              "unique reader"
            )}
            !
          </h1>

          <p className="text-base text-white/70 text-center mb-8">
            {getPersonaDescription(persona.personaType || "")}
          </p>

          {/* Explore Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-primary/20 hover:bg-primary/30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-primary/30 backdrop-blur-sm flex items-center justify-center gap-2 hover:border-primary/50"
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
          <p className="mt-6 text-sm text-white/50 text-center">
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
