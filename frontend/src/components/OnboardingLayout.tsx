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
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#A7F3D0] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        {/* Progress Circles */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx + 1 === currentStep ? "bg-black scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <h1 className="text-3xl font-extrabold text-black text-center mb-8 leading-tight tracking-tight">
          {title}
        </h1>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
