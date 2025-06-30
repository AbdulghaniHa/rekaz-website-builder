import React from "react";
import Image from "next/image";

interface ContentSectionProps {
  title?: string;
  content?: string;
  image?: string;
  layout?: "left" | "right" | "center";
  showButton?: boolean;
  buttonText?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title = "About Our Service",
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  image = "",
  layout = "left",
  showButton = true,
  buttonText = "Learn More",
}) => {
  console.log("ContentSection rendered with props:", {
    title,
    layout,
    showButton,
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            layout === "right" ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          <div className={layout === "right" ? "lg:col-start-2" : ""}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content}
            </p>
            {showButton && (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                {buttonText}
              </button>
            )}
          </div>

          <div className={layout === "right" ? "lg:col-start-1" : ""}>
            {image ? (
              <Image
                src={image}
                alt={title}
                width={600}
                height={256}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Image Placeholder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
