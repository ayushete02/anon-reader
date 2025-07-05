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
      {/* Enhanced background blur effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -inset-[500px] bg-[radial-gradient(circle_800px_at_100%_200px,rgba(93,93,255,0.1),transparent)] pointer-events-none" />

      <div className="max-w-md w-full bg-morphic-gray/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col items-center relative z-10 hover:bg-morphic-gray/60 hover:border-white/20 transition-all duration-500">
        {/* Logo or Brand */}
        <div className="mb-8">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            comics.ai
          </div>
        </div>

        {/* Progress Circles */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 hover:scale-110 ${
                idx + 1 === currentStep
                  ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                  : idx + 1 < currentStep
                  ? "bg-primary/60 shadow-md shadow-primary/30"
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
      <div className="mt-4 sm:mt-6 lg:mt-8 px-4 text-center">
        <div className="text-xs sm:text-sm text-white/60 max-w-sm mx-auto leading-relaxed">
          Discover your unique AI-powered reading preferences
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
