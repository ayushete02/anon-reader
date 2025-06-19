"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { StoryDraft, Character } from "@/lib/types";
import StoryDetailsForm from "@/components/producer/StoryDetailsForm";
import CharacterCreator from "@/components/producer/CharacterCreator";
import StoryPreview from "@/components/producer/StoryPreview";

type Step = "details" | "characters" | "preview";

const ProducerPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyDraft, setStoryDraft] = useState<Partial<StoryDraft>>({
    title: "",
    description: "",
    plot: "",
    type: "text",
    characters: [],
    categories: [],
    createdBy: "",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Update createdBy when user becomes available
  useEffect(() => {
    if (user && !storyDraft.createdBy) {
      setStoryDraft((prev) => ({
        ...prev,
        createdBy: user.id,
      }));
    }
  }, [user, storyDraft.createdBy]);

  // Handle user authentication redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Save draft to localStorage
  useEffect(() => {
    if (storyDraft.title || storyDraft.description || storyDraft.plot) {
      localStorage.setItem("storyDraft", JSON.stringify(storyDraft));
    }
  }, [storyDraft]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("storyDraft");
    if (savedDraft && user) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.createdBy === user.id) {
          setStoryDraft(parsed);
        }
      } catch (error) {
        console.error("Error loading saved draft:", error);
      }
    }
  }, [user]); // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary text-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }
  const handleStoryDetailsSubmit = (details: Partial<StoryDraft>) => {
    const updatedDraft = {
      ...storyDraft,
      ...details,
      updatedAt: new Date().toISOString(),
    };
    setStoryDraft(updatedDraft);
    setCurrentStep("characters");
  };

  const handleCharactersSubmit = (characters: Character[]) => {
    const updatedDraft = {
      ...storyDraft,
      characters,
      updatedAt: new Date().toISOString(),
    };
    setStoryDraft(updatedDraft);
    setCurrentStep("preview");
  };

  const handlePublishStory = async (finalStory: StoryDraft) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would call an API to publish the story
      console.log("Publishing story:", finalStory);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear the draft from localStorage after successful publish
      localStorage.removeItem("storyDraft");

      // Show success message
      alert(
        "Story published successfully! Your comic is now available to readers."
      );

      // Redirect to browse page
      router.push("/browse");
    } catch (error) {
      console.error("Error publishing story:", error);
      alert("Failed to publish story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackStep = () => {
    if (currentStep === "characters") {
      setCurrentStep("details");
    } else if (currentStep === "preview") {
      setCurrentStep("characters");
    }
  };

  const handleStartOver = () => {
    if (
      confirm(
        "Are you sure you want to start over? All your progress will be lost."
      )
    ) {
      localStorage.removeItem("storyDraft");
      setStoryDraft({
        title: "",
        description: "",
        plot: "",
        type: "text",
        characters: [],
        categories: [],
        createdBy: user?.id || "",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setCurrentStep("details");
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "details":
        return 33;
      case "characters":
        return 66;
      case "preview":
        return 100;
      default:
        return 0;
    }
  };
  return (
    <div className="min-h-screen bg-secondary text-accent relative overflow-hidden">
      {/* Background blur effects for visual appeal */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Exit Button */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-accent">
                Create Your Story
              </h1>
              <p className="text-accent/70">
                Bring your ideas to life with our AI-powered comic generation
              </p>
            </div>{" "}
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/browse")}
                className="px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg text-sm transition-all duration-300 text-accent hover:scale-105 backdrop-blur-sm"
              >
                Exit
              </button>
              <button
                onClick={handleStartOver}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm transition-all duration-300 text-primary hover:scale-105 backdrop-blur-sm"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>{" "}
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-accent/10 rounded-full h-3 mb-4 border border-accent/20 shadow-inner">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 shadow-lg shadow-primary/25"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {" "}
            <div
              className={`flex items-center ${
                currentStep === "details" ? "text-primary" : "text-accent/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm font-semibold border-2 ${
                  currentStep === "details"
                    ? "bg-primary text-accent border-primary"
                    : getProgressPercentage() > 33
                    ? "bg-green-600 text-accent border-green-600"
                    : "bg-secondary/60 border-accent/20 text-accent/60"
                }`}
              >
                {getProgressPercentage() > 33 ? "✓" : "1"}
              </div>
              <span className="font-medium">Story Details</span>
            </div>
            <div className="w-16 h-0.5 bg-accent/20">
              <div
                className={`h-full transition-all duration-300 ${
                  getProgressPercentage() > 33 ? "bg-green-600" : "bg-accent/20"
                }`}
                style={{ width: getProgressPercentage() > 33 ? "100%" : "0%" }}
              ></div>
            </div>
            <div
              className={`flex items-center ${
                currentStep === "characters" ? "text-primary" : "text-accent/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm font-semibold border-2 ${
                  currentStep === "characters"
                    ? "bg-primary text-accent border-primary"
                    : getProgressPercentage() > 66
                    ? "bg-green-600 text-accent border-green-600"
                    : "bg-secondary/60 border-accent/20 text-accent/60"
                }`}
              >
                {getProgressPercentage() > 66 ? "✓" : "2"}
              </div>
              <span className="font-medium">Characters</span>
            </div>
            <div className="w-16 h-0.5 bg-accent/20">
              <div
                className={`h-full transition-all duration-300 ${
                  getProgressPercentage() > 66 ? "bg-green-600" : "bg-accent/20"
                }`}
                style={{ width: getProgressPercentage() > 66 ? "100%" : "0%" }}
              ></div>
            </div>
            <div
              className={`flex items-center ${
                currentStep === "preview" ? "text-primary" : "text-accent/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm font-semibold border-2 ${
                  currentStep === "preview"
                    ? "bg-primary text-accent border-primary"
                    : "bg-secondary/60 border-accent/20 text-accent/60"
                }`}
              >
                3
              </div>
              <span className="font-medium">Preview & Publish</span>
            </div>
          </div>
        </div>{" "}
        {/* Step Content */}
        <div className="bg-accent/5 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-accent/20 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-2xl"></div>
          <div className="relative z-10">
            {isSubmitting && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-secondary/90 backdrop-blur-md p-8 rounded-2xl text-center border border-accent/20 shadow-2xl max-w-md mx-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-xl font-semibold text-accent">
                    Publishing your story...
                  </p>
                  <p className="text-accent/70 mt-2">
                    This may take a few moments
                  </p>
                </div>
              </div>
            )}
            {currentStep === "details" && (
              <StoryDetailsForm
                initialData={storyDraft}
                onSubmit={handleStoryDetailsSubmit}
              />
            )}
            {currentStep === "characters" && (
              <CharacterCreator
                initialCharacters={storyDraft.characters || []}
                onSubmit={handleCharactersSubmit}
                onBack={handleBackStep}
              />
            )}{" "}
            {currentStep === "preview" && (
              <StoryPreview
                storyDraft={storyDraft as StoryDraft}
                onPublish={handlePublishStory}
                onBack={handleBackStep}
              />
            )}
          </div>
        </div>{" "}
        {/* Auto-save indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center text-sm text-accent/70 bg-accent/5 px-4 py-2 rounded-full border border-accent/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-lg shadow-green-500/50"></div>
            Your progress is automatically saved
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerPage;
