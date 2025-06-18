import React from "react";

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  currentStep,
  totalSteps,
  title,
  children,
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-400">Building your persona</span>
        </div>

        <div className="onboarding-progress-bar mb-8">
          <div
            className="onboarding-progress-bar-filled"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;
