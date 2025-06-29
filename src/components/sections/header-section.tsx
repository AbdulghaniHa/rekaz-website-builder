import React from "react";

interface HeaderSectionProps {
  logo?: string;
  brandName?: string;
  menuItems?: string[];
  showCTA?: boolean;
  ctaText?: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  logo = "",
  brandName = "Brand",
  menuItems = ["Home", "About", "Services", "Contact"],
  showCTA = true,
  ctaText = "Get Started",
}) => {
  console.log("HeaderSection rendered with props:", {
    brandName,
    menuItems,
    showCTA,
  });

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {logo && (
              <img src={logo} alt={brandName} className="h-8 w-8 mr-3" />
            )}
            <span className="text-xl font-bold text-gray-900">{brandName}</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {showCTA && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
