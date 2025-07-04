"use client";

import { useState } from "react";
import { Character, CharacterType, CHARACTER_TYPES } from "@/lib/types";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setDialogOpen(true);
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setDialogOpen(true);
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
    setDialogOpen(false);
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
          <p className="text-white/60">
            Bring your characters to life with detailed descriptions and
            AI-generated visuals
          </p>
        </div>
        <button
          onClick={handleAddCharacter}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary/20 border border-primary/30 text-white rounded-xl font-medium backdrop-blur-sm hover:bg-primary/30 hover:border-primary/40 transition-all duration-150"
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
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Characters Created</span>
          <span className="text-white font-medium">
            {characters.length} / 8 recommended
          </span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 mt-2">
          <div
            className="bg-primary/50 backdrop-blur-xl h-2 rounded-full transition-all duration-500"
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
            <span className="text-sm text-white/60">
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
          <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-white/40"
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
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Start building your story&apos;s cast. Create compelling characters
            that will drive your narrative forward.
          </p>
          <button
            onClick={handleAddCharacter}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-150"
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
            Create First Character
          </button>
        </div>
      )}

      {/* Character Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-morphic-gray/95 backdrop-blur-2xl border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingCharacter?.id ? "Edit Character" : "Create New Character"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingCharacter?.id
                ? "Update your character's details below"
                : "Fill in the details to create a new character"}
            </DialogDescription>
          </DialogHeader>
          {editingCharacter && (
            <CharacterForm
              character={editingCharacter}
              onSave={handleSaveCharacter}
              onCancel={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Action Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-150"
        >
          ← Back to Details
        </button>
        <button
          onClick={handleSubmit}
          disabled={characters.length === 0}
          className={`px-8 py-3 rounded-xl font-medium backdrop-blur-sm transition-all duration-150 ${
            characters.length > 0
              ? "bg-primary/20 border border-primary/30 text-white hover:bg-primary/30 hover:border-primary/40"
              : "bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
          }`}
        >
          Continue to Preview
        </button>
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
  const typeLabel =
    CHARACTER_TYPES.find((t) => t.value === character.type)?.label ||
    character.type;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-150">
      {/* Character Image */}
      <div className="relative aspect-square">
        {character.imageUrl ? (
          <Image
            src={character.imageUrl}
            alt={character.name}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <svg
              className="w-12 h-12 text-white/40"
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
        )}
        {!character.isGenerated && (
          <button
            onClick={onGenerateImage}
            className="absolute bottom-4 right-4 p-2 bg-primary/20 border border-primary/30 rounded-lg backdrop-blur-sm hover:bg-primary/30 hover:border-primary/40 transition-all duration-150"
            title="Generate AI Image"
          >
            <svg
              className="w-5 h-5 text-white"
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
          </button>
        )}
      </div>

      {/* Character Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
              {character.name}
            </h3>
            <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-medium backdrop-blur-sm">
              {typeLabel}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-150"
              title="Edit Character"
            >
              <svg
                className="w-4 h-4 text-white/60"
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
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-150"
              title="Delete Character"
            >
              <svg
                className="w-4 h-4 text-white/60"
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
        </div>
        <p className="text-white/60 text-sm mt-3 line-clamp-3">
          {character.description}
        </p>
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
  const [formData, setFormData] = useState(character);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.type) {
      newErrors.type = "Character type is required";
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
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-2 text-white/80"
        >
          Character Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/20 backdrop-blur-sm transition-all duration-150"
          placeholder="Enter character name..."
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-2">{errors.name}</p>
        )}
      </div>

      {/* Character Type */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white/80">
          Character Type *
        </label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value as CharacterType })
          }
        >
          <SelectTrigger className="w-full px-4 py-6 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/20 backdrop-blur-sm transition-all duration-150">
            <SelectValue placeholder="Select a character type" />
          </SelectTrigger>
          <SelectContent className="bg-morphic-gray/95 backdrop-blur-2xl border-white/10">
            {CHARACTER_TYPES.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="text-white/80 focus:bg-white/10 focus:text-white"
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-red-400 text-sm mt-2">{errors.type}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2 text-white/80"
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
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/20 backdrop-blur-sm transition-all duration-150"
          placeholder="Describe your character's personality, appearance, and role in the story..."
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-2">{errors.description}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white/80">
          Character Image
        </label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {formData.imageUrl ? (
              <Image
                src={formData.imageUrl}
                alt={formData.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                <svg
                  className="w-8 h-8"
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
              </div>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-150"
            >
              <svg
                className="w-5 h-5 mr-2 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-sm font-medium text-white/80">
                Upload Image
              </span>
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-primary/20 border border-primary/30 rounded-xl text-white font-medium backdrop-blur-sm hover:bg-primary/30 hover:border-primary/40 transition-all duration-150"
        >
          Save Character
        </button>
      </div>
    </form>
  );
};

export default CharacterCreator;
