"use client";

import AuthGuard from "@/components/AuthGuard";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} from "@/components/contract/contractDetails";
import CharacterCreator from "@/components/producer/CharacterCreator";
import StoryDetailsForm from "@/components/producer/StoryDetailsForm";
import StoryPreview from "@/components/producer/StoryPreview";
import { useUser } from "@/context/UserContext";
import { Character, StoryDraft } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";

type Step = "details" | "characters" | "preview";

const ProducerPage = () => {
  const { writeContract } = useWriteContract();

  const chainId = useChainId();
  const { address } = useAccount();
  const { user, loading } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("details");
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
      <div className="min-h-screen bg-morphic-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary/50 mx-auto mb-4"></div>
          <p className="text-xl text-white/80">Loading...</p>
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

  const publishStory = async (cid: string) => {
    writeContract({
      abi: CONTRACT_ABI,
      address: CONTRACT_ADDRESS,
      functionName: "publishStory",
      args: [cid],
    });
  };

  const handlePublishStory = async (finalStory: StoryDraft) => {
    try {
      console.log("Story generated successfully:", finalStory);

      // Save the generated story to localStorage for viewing
      const savedStories = localStorage.getItem("generatedStories");
      let stories = [];

      if (savedStories) {
        try {
          stories = JSON.parse(savedStories);
        } catch (error) {
          console.error("Error parsing saved stories:", error);
          stories = [];
        }
      }

      // Add the new story to the list
      stories.push(finalStory);
      localStorage.setItem("generatedStories", JSON.stringify(stories));

      // Clear the draft from localStorage after successful generation
      localStorage.removeItem("storyDraft");

      // Redirect to the generated story viewer page
      if (finalStory.id) {
        router.push(`/story/generated/${finalStory.id}`);
      } else {
        console.error("No story ID found");
        router.push("/browse");
      }
    } catch (error) {
      console.error("Error handling published story:", error);
      // Remove alert, handle error silently or show in UI
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
    <AuthGuard requireAuth={true}>
      <button
        onClick={() =>
          publishStory(
            "https://gateway.lighthouse.storage/ipfs/bafkreidceczfcgbdbj7xsklj4e4z33uzqsoxjvaiwinvmvvk3ij6gkgccm"
          )
        }
      >
        Publish
      </button>
      <a>Helo: {chainId}</a>
      <a>Address: {address}</a>
      <div className="min-h-screen bg-morphic-dark text-white relative overflow-hidden">
        {/* Enhanced glossy background effects */}
        <div className="absolute inset-0">
          <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />
          <div className="absolute -inset-[500px] bg-[radial-gradient(circle_600px_at_0%_800px,rgba(93,93,255,0.07),transparent)] pointer-events-none" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute -bottom-8 right-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute bottom-24 left-24 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        {/* Top Navigation Bar */}
        <nav className="relative z-20 bg-morphic-gray/30 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-display">
                    S
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">
                    Story Creator
                  </h1>
                  <p className="text-white/60 text-sm">
                    Create your next masterpiece
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
                  <span
                    className={currentStep === "details" ? "text-white" : ""}
                  >
                    Details
                  </span>
                  <span>→</span>
                  <span
                    className={currentStep === "characters" ? "text-white" : ""}
                  >
                    Characters
                  </span>
                  <span>→</span>
                  <span
                    className={currentStep === "preview" ? "text-white" : ""}
                  >
                    Preview
                  </span>
                </div>
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/50 backdrop-blur-xl transition-all duration-300 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className=" mx-auto px-6 py-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mb-8">
              {currentStep !== "details" && (
                <button
                  onClick={handleBackStep}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-150"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleStartOver}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 backdrop-blur-sm transition-all duration-150"
              >
                Start Over
              </button>
            </div>

            {/* Form Steps */}
            <div className="bg-morphic-gray/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-glossy">
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
                  onBack={() => setCurrentStep("details")}
                />
              )}
              {currentStep === "preview" && (
                <StoryPreview
                  storyDraft={storyDraft as StoryDraft}
                  onPublish={handlePublishStory}
                  onBack={() => setCurrentStep("characters")}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default ProducerPage;
