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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Character Creator</h2>
        <button
          onClick={handleAddCharacter}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Add Character
        </button>
      </div>

      {/* Characters List */}
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onEdit={() => handleEditCharacter(character)}
              onDelete={() => handleDeleteCharacter(character.id)}
              onGenerateImage={() => handleGenerateImage(character)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="mb-4">No characters added yet</p>
          <button
            onClick={handleAddCharacter}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Add Your First Character
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
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-600">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
        >
          Back to Story Details
        </button>

        {characters.length > 0 && (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Next: Preview & Publish
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
    <div className="bg-gray-700 rounded-lg p-4 space-y-3">
      {/* Character Image */}
      <div className="aspect-square bg-gray-600 rounded-lg overflow-hidden relative">
        {character.imageUrl ? (
          <Image
            src={character.imageUrl}
            alt={character.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Character Info */}
      <div>
        <h3 className="font-bold text-lg">
          {character.name || "Unnamed Character"}
        </h3>
        <p className="text-sm text-gray-300 capitalize">
          {character.type.replace("-", " ")}
        </p>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
          {character.description || "No description provided"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 transition-colors"
        >
          Edit
        </button>
        {!character.imageUrl && (
          <button
            onClick={onGenerateImage}
            className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-500 transition-colors"
          >
            Generate Image
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition-colors"
        >
          Delete
        </button>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {character.name ? "Edit Character" : "Add Character"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Character Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Character Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Enter character name..."
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Character Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
            >
              {CHARACTER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Character Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Character Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Describe the character's personality, role, and appearance..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Character Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Character Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-1">
              Upload an image or leave empty to generate with AI later
            </p>
          </div>

          {/* Current Image Preview */}
          {formData.imageUrl && (
            <div className="relative w-20 h-20 bg-gray-600 rounded-lg overflow-hidden">
              <Image
                src={formData.imageUrl}
                alt="Character preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Save Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreator;
