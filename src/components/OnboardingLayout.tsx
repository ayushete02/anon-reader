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
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-morphic-dark px-4 py-12 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />

      <div className="max-w-md w-full bg-morphic-gray/50 backdrop-blur-xl rounded-3xl border border-white/5 p-8 flex flex-col items-center relative z-10">
        {/* Logo or Brand */}
        <div className="mb-8">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Anon Reader
          </div>
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
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-8 leading-tight tracking-tight">
          {title}
        </h1>

        <div className="w-full">{children}</div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-sm text-white/60">
        Discover your unique reading preferences
      </div>
    </div>
  );
};

export default OnboardingLayout;
