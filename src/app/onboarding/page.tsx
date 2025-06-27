"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "@/components/OnboardingLayout";
import QuestionOptionsSelector from "@/components/QuestionOptionsSelector";
import { PERSONA_QUESTIONS } from "@/lib/types";
import { determinePersonaType } from "@/lib/utils";
import AuthGuard from "@/components/AuthGuard";

const steps = [
  "welcome",
  "storyEnding",
  "thisOrThat1", // Justice or Mercy
  "thisOrThat2", // Perfect Plan or Glorious Mess
  "thisOrThat3", // Calculated Risk or Leap of Faith
  "thisOrThat4", // Shocking Twist or Satisfying Payoff
  "thisOrThat5", // Unshakeable Hope or Brutal Honesty
  "thisOrThat6", // Greater Good or Personal Bond
  "vibes",
  "favoriteTwist",
];

const thisOrThatQuestions = [
  {
    key: "justiceOrMercy",
    title: "Justice or Mercy?",
    options: ["Justice", "Mercy"],
  },
  {
    key: "planOrMess",
    title: "A Perfect Plan or A Glorious Mess?",
    options: ["Perfect Plan", "Glorious Mess"],
  },
  {
    key: "riskOrFaith",
    title: "A Calculated Risk or A Leap of Faith?",
    options: ["Calculated Risk", "Leap of Faith"],
  },
  {
    key: "twistOrPayoff",
    title: "A Shocking Twist or A Satisfying Payoff?",
    options: ["Shocking Twist", "Satisfying Payoff"],
  },
  {
    key: "hopeOrHonesty",
    title: "Unshakeable Hope or Brutal Honesty?",
    options: ["Unshakeable Hope", "Brutal Honesty"],
  },
  {
    key: "greaterGoodOrPersonalBond",
    title: "The Greater Good or The Personal Bond?",
    options: ["Greater Good", "Personal Bond"],
  },
];

interface Persona {
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
  [key: string]: string | string[];
}

const OnboardingPage = () => {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [persona, setPersona] = useState<Persona>({
    storyEndingPreference: "",
    justiceOrMercy: "",
    planOrMess: "",
    riskOrFaith: "",
    twistOrPayoff: "",
    hopeOrHonesty: "",
    greaterGoodOrPersonalBond: "",
    vibes: [],
    favoriteTwist: "",
    personaType: "",
  });

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  const getStepTitle = () => {
    if (currentStep.startsWith("thisOrThat")) {
      const thisOrThatIndex = parseInt(currentStep.slice(-1)) - 1;
      return thisOrThatQuestions[thisOrThatIndex].title;
    }

    return (
      PERSONA_QUESTIONS[currentStep as keyof typeof PERSONA_QUESTIONS]?.title ||
      ""
    );
  };

  const getStepOptions = () => {
    if (currentStep.startsWith("thisOrThat")) {
      const thisOrThatIndex = parseInt(currentStep.slice(-1)) - 1;
      return thisOrThatQuestions[thisOrThatIndex].options;
    }

    return (
      PERSONA_QUESTIONS[currentStep as keyof typeof PERSONA_QUESTIONS]
        ?.options || []
    );
  };

  const getSelectedOptions = (): string[] => {
    if (currentStep === "welcome") return [];
    if (currentStep === "storyEnding")
      return persona.storyEndingPreference
        ? [persona.storyEndingPreference]
        : [];
    if (currentStep === "vibes") return persona.vibes;
    if (currentStep === "favoriteTwist")
      return persona.favoriteTwist ? [persona.favoriteTwist] : [];

    if (currentStep.startsWith("thisOrThat")) {
      const thisOrThatIndex = parseInt(currentStep.slice(-1)) - 1;
      const key = thisOrThatQuestions[thisOrThatIndex].key;
      return persona[key] ? [persona[key] as string] : [];
    }

    return [];
  };

  const handleOptionSelect = (option: string) => {
    if (currentStep === "welcome") {
      goToNextStep();
      return;
    }

    if (currentStep === "storyEnding") {
      setPersona((prev) => ({ ...prev, storyEndingPreference: option }));
      setTimeout(goToNextStep, 500);
      return;
    }

    if (currentStep === "vibes") {
      setPersona((prev) => {
        const updatedVibes = prev.vibes.includes(option)
          ? prev.vibes.filter((v: string) => v !== option)
          : [...prev.vibes, option];
        return { ...prev, vibes: updatedVibes };
      });
      return;
    }

    if (currentStep === "favoriteTwist") {
      setPersona((prev) => ({ ...prev, favoriteTwist: option }));
      setTimeout(() => {
        const personaType = determinePersonaType(persona);
        setPersona((prev) => ({ ...prev, personaType }));
        router.push("/onboarding/result");
      }, 500);
      return;
    }

    if (currentStep.startsWith("thisOrThat")) {
      const thisOrThatIndex = parseInt(currentStep.slice(-1)) - 1;
      const key = thisOrThatQuestions[thisOrThatIndex].key;
      setPersona((prev) => ({ ...prev, [key]: option }));
      setTimeout(goToNextStep, 500);
      return;
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const renderContent = () => {
    if (currentStep === "welcome") {
      return (
        <div className="text-center">
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
            Let&apos;s discover your unique story preferences
          </p>
          <button
            className="bg-primary text-white py-3 px-8 rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors shadow-soft hover:shadow-hover"
            onClick={goToNextStep}
          >
            Start Journey
          </button>
        </div>
      );
    }

    if (currentStep === "vibes") {
      return (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Select 3-5 options that speak to you
          </p>
          <QuestionOptionsSelector
            options={getStepOptions()}
            selectedOptions={getSelectedOptions()}
            onSelect={handleOptionSelect}
            multiSelect={true}
            maxSelections={5}
          />
          {persona.vibes.length >= 3 && (
            <div className="mt-8 text-center">
              <button
                className="bg-primary text-white py-3 px-8 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-soft hover:shadow-hover"
                onClick={goToNextStep}
              >
                Continue
              </button>
            </div>
          )}
        </>
      );
    }

    return (
      <QuestionOptionsSelector
        options={getStepOptions()}
        selectedOptions={getSelectedOptions()}
        onSelect={handleOptionSelect}
        multiSelect={false}
      />
    );
  };

  // Save persona to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userPersona", JSON.stringify(persona));
    }
  }, [persona]);
  return (
    <AuthGuard requireAuth={true}>
      <OnboardingLayout
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        title={getStepTitle()}
      >
        {renderContent()}
      </OnboardingLayout>
    </AuthGuard>
  );
};

export default OnboardingPage;
