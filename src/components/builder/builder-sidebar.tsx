"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionTemplate } from "@/types/builder";
import {
  sectionTemplates,
  getSectionsByCategory,
} from "@/lib/section-templates";
import { SectionTemplateCard } from "./section-template-card";
import * as Icons from "lucide-react";

const categories = [
  { id: "layout", name: "Layout", icon: "Layout" },
  { id: "navigation", name: "Navigation", icon: "Menu" },
  { id: "content", name: "Content", icon: "FileText" },
  { id: "media", name: "Media", icon: "Image" },
] as const;

export const BuilderSidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] =
    useState<SectionTemplate["category"]>("layout");
  const [searchQuery, setSearchQuery] = useState("");

  console.log("BuilderSidebar rendered, activeCategory:", activeCategory);

  const handleDragStart = (template: SectionTemplate) => {
    console.log("Drag started in sidebar for template:", template.name);
  };

  const activeSections = getSectionsByCategory(activeCategory).filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-80 h-full bg-gray-50 lg:border-r border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Section Library
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag sections to the canvas or click the + icon
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Icons.Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => {
            const IconComponent = Icons[
              category.icon as keyof typeof Icons
            ] as React.ComponentType<{
              size?: number;
              className?: string;
            }>;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() =>
                  setActiveCategory(category.id as SectionTemplate["category"])
                }
                className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {IconComponent && <IconComponent size={16} />}
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Templates */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {activeSections.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <SectionTemplateCard
                  template={template}
                  onDragStart={handleDragStart}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {activeSections.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Icons.Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No sections found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer - Hidden on mobile */}
      <div className="hidden lg:block p-4 border-t border-gray-200 bg-white">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Drag and drop sections or click + to add to your page
          </p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Ready to build</span>
          </div>
        </div>
      </div>
    </div>
  );
};
