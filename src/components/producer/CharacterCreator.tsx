"use client";

import { useState } from "react";
import { Character, CharacterType, CHARACTER_TYPES } from "@/lib/types";
import Image from "next/image";

interface CharacterCreatorProps {
  initialCharacters: Character[];
  onSubmit: (characters: Character[]) => void;
  onBack: () => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  initialCharacters,
  onSubmit,
  onBack,
}) => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);

  const createNewCharacter = (): Character => ({
    id: Date.now().toString(),
    name: "",
    description: "",
    type: "protagonist",
    imageUrl: "",
    isGenerated: false,
  });

  const handleAddCharacter = () => {
    setEditingCharacter(createNewCharacter());
    setShowForm(true);
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const handleSaveCharacter = (characterData: Character) => {
    if (characters.find((c) => c.id === characterData.id)) {
      // Update existing character
      setCharacters(
        characters.map((c) => (c.id === characterData.id ? characterData : c))
      );
    } else {
      // Add new character
      setCharacters([...characters, characterData]);
    }
    setShowForm(false);
    setEditingCharacter(null);
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters(characters.filter((c) => c.id !== characterId));
  };

  const handleGenerateImage = async (character: Character) => {
    // In a real app, this would call an AI image generation API
    const generatedImageUrl = `/comics/placeholder.jpg`; // Placeholder

    const updatedCharacter = {
      ...character,
      imageUrl: generatedImageUrl,
      isGenerated: true,
    };

    handleSaveCharacter(updatedCharacter);
    alert("Character image generated! (In a real app, this would use AI)");
  };

  const handleSubmit = () => {
    if (characters.length === 0) {
      alert("Please add at least one character");
      return;
    }
    onSubmit(characters);
  };
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Character Creator
          </h2>
          <p className="text-gray-400">
            Bring your characters to life with detailed descriptions and
            AI-generated visuals
          </p>
        </div>
        <button
          onClick={handleAddCharacter}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Character
        </button>
      </div>
      {/* Progress Indicator */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Characters Created</span>
          <span className="text-white font-medium">
            {characters.length} / 8 recommended
          </span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((characters.length / 8) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>
      {/* Characters List */}
      {characters.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Your Characters
            </h3>
            <span className="text-sm text-gray-400">
              {characters.length} character{characters.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {characters.map((character, index) => (
              <div
                key={character.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CharacterCard
                  character={character}
                  onEdit={() => handleEditCharacter(character)}
                  onDelete={() => handleDeleteCharacter(character.id)}
                  onGenerateImage={() => handleGenerateImage(character)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No characters yet
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start building your story&apos;s cast. Create compelling characters
            that will drive your narrative forward.
          </p>
          <button
            onClick={handleAddCharacter}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Your First Character
          </button>
        </div>
      )}
      {/* Character Form Modal */}
      {showForm && editingCharacter && (
        <CharacterForm
          character={editingCharacter}
          onSave={handleSaveCharacter}
          onCancel={() => {
            setShowForm(false);
            setEditingCharacter(null);
          }}
        />
      )}{" "}
      {/* Enhanced Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-800/50">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Story Details
        </button>

        {characters.length > 0 && (
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
          >
            Next: Preview & Publish
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Character Card Component
interface CharacterCardProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
  onGenerateImage: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onEdit,
  onDelete,
  onGenerateImage,
}) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300 group">
      {/* Character Image */}
      <div className="aspect-square bg-gray-800/50 rounded-xl overflow-hidden relative mb-4 group-hover:scale-[1.02] transition-transform duration-300">
        {character.imageUrl ? (
          <>
            <Image
              src={character.imageUrl}
              alt={character.name}
              fill
              className="object-cover"
            />
            {character.isGenerated && (
              <div className="absolute top-2 right-2 bg-green-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                AI Generated
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-gray-400 transition-colors">
            <svg
              className="w-16 h-16 mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Character Info */}
      <div className="space-y-3 mb-6">
        <div>
          <h3 className="font-bold text-lg text-white mb-1">
            {character.name || "Unnamed Character"}
          </h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
              {character.type
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
          {character.description || "No description provided"}
        </p>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-sm font-medium rounded-lg border border-blue-600/30 hover:border-blue-600/40 transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 text-sm font-medium rounded-lg border border-red-600/30 hover:border-red-600/40 transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {!character.imageUrl && (
          <button
            onClick={onGenerateImage}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 text-sm font-medium rounded-lg border border-green-600/30 hover:border-green-600/40 transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Generate AI Image
          </button>
        )}
      </div>
    </div>
  );
};

// Character Form Component
interface CharacterFormProps {
  character: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Character>(character);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Character name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Character description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl, isGenerated: false });
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {character.name ? "Edit Character" : "Create New Character"}
              </h3>
              <p className="text-gray-400 mt-1">
                Define your character&apos;s traits and personality
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Character Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-3"
              >
                Character Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
                placeholder="Enter character name..."
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Character Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-white mb-3"
              >
                Character Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as CharacterType,
                  })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
              >
                {CHARACTER_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                    className="bg-gray-800"
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Character Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-3"
              >
                Character Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Describe the character's personality, role, appearance, and background..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Character Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Character Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                {/* Current Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl}
                        alt="Character preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Input */}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Upload an image or leave empty to generate with AI later
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-800/50">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
            >
              Save Character
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
