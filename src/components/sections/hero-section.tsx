import React from "react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backgroundImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Welcome to Our Amazing Website",
  subtitle = "Discover the power of our innovative solutions",
  buttonText = "Get Started",
  backgroundImage = "",
}) => {
  console.log("HeroSection rendered with props:", {
    title,
    subtitle,
    buttonText,
  });

  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 text-gray-900">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-700">{subtitle}</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
          {buttonText}
        </button>
      </div>
    </section>
  );
};
