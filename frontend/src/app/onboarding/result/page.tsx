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
      <div className="min-h-screen bg-[#87F29A] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 text-black font-semibold">Creating your unique profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#87F29A] px-2 py-4">
      <div className="w-full max-w-xs sm:max-w-sm bg-[#87F29A] rounded-[2.5rem] shadow-xl flex flex-col px-6 py-8 relative items-center" style={{ boxShadow: "0 8px 32px 0 rgba(34, 60, 80, 0.2)" }}>
        {/* Persona Type Pill */}
        <span className="inline-block bg-black text-white text-lg font-bold py-2 px-6 rounded-full mb-6 mt-2">
          {persona.personaType || "Your Persona"}
        </span>
        {/* Main Text */}
        <h1 className="text-2xl font-extrabold text-black text-center mb-4 leading-tight">
          You&apos;re a {persona.personaType ? <span className="text-black">{persona.personaType}</span> : "unique reader"}!
        </h1>
        <p className="text-lg text-black text-center mb-8">
          {getPersonaDescription(persona.personaType || "")}
        </p>
        {/* Explore Button */}
        <button
          onClick={handleContinue}
          className="w-full flex items-center rounded-full overflow-hidden shadow-lg mb-6 mt-2"
          style={{ height: "56px" }}
        >
          <span className="flex-1 h-full bg-white flex items-center justify-center text-black font-bold text-lg rounded-l-full">Explore</span>
          <span className="flex items-center justify-center bg-black h-full px-6 rounded-r-full">
            <span className="text-white text-2xl font-bold">&gt;&gt;&gt;</span>
          </span>
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
