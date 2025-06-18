import React from "react";

interface QuestionOptionsSelectorProps {
  options: string[];
  selectedOptions: string[];
  onSelect: (option: string) => void;
  multiSelect?: boolean;
  maxSelections?: number;
}

const QuestionOptionsSelector: React.FC<QuestionOptionsSelectorProps> = ({
  options,
  selectedOptions,
  onSelect,
  multiSelect = false,
  maxSelections = 0,
}) => {
  const handleOptionClick = (option: string) => {
    onSelect(option);
  };

  const isDisabled = (option: string) => {
    if (!multiSelect) return false;
    if (maxSelections === 0) return false;
    return (
      !selectedOptions.includes(option) &&
      selectedOptions.length >= maxSelections
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option}
          className={`persona-option p-4 rounded-lg text-left transition-all ${
            selectedOptions.includes(option)
              ? "border-primary bg-opacity-10 bg-primary"
              : "border-gray-700 hover:border-gray-500"
          } ${
            isDisabled(option)
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={() => !isDisabled(option) && handleOptionClick(option)}
          disabled={isDisabled(option)}
        >
          <span className="block text-lg">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default QuestionOptionsSelector;
