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
    <div className="flex flex-col gap-6 w-full">
      {options.map((option) => {
        const selected = selectedOptions.includes(option);
        return (
          <button
            key={option}
            className={`w-full py-5 px-6 rounded-full shadow-md text-2xl font-bold transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-black
              ${selected ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-gray-100"}
              ${isDisabled(option) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={() => !isDisabled(option) && handleOptionClick(option)}
            disabled={isDisabled(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionOptionsSelector;
