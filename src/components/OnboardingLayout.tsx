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
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-secondary rounded-2xl shadow-soft p-8 flex flex-col items-center">
        {/* Logo or Brand */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-primary">Anon Reader</div>
        </div>

        {/* Progress Circles */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx + 1 === currentStep
                  ? "bg-primary scale-125"
                  : idx + 1 < currentStep
                  ? "bg-primary/60"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <h1 className="text-3xl font-bold text-secondary dark:text-white text-center mb-8 leading-tight tracking-tight">
          {title}
        </h1>

        <div className="w-full">{children}</div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Discover your unique reading preferences
      </div>
    </div>
  );
};

export default OnboardingLayout;
