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
    <div className="flex flex-col gap-4 w-full">
      {options.map((option) => {
        const selected = selectedOptions.includes(option);
        return (
          <button
            key={option}
            className={`group w-full py-4 px-6 rounded-2xl text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 border backdrop-blur-lg
              ${
                selected
                  ? "bg-primary/20 border-primary/50 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
              }
              ${
                isDisabled(option)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
            onClick={() => !isDisabled(option) && handleOptionClick(option)}
            disabled={isDisabled(option)}
          >
            <div className="flex items-center justify-between">
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                {option}
              </span>
              {selected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        );
      })}

      {multiSelect && maxSelections > 0 && (
        <div className="text-sm text-white/60 mt-2 text-center">
          Select {maxSelections > 1 ? `up to ${maxSelections}` : "one"} option
          {maxSelections > 1 ? "s" : ""}
          {selectedOptions.length > 0 &&
            ` (${selectedOptions.length}/${maxSelections} selected)`}
        </div>
      )}
    </div>
  );
};

export default QuestionOptionsSelector;
