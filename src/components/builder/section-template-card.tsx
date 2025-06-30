"use client";

import React from "react";
import { motion } from "motion/react";
import { SectionTemplate } from "@/types/builder";
import { useBuilderActions } from "@/stores/builder-store";
import * as Icons from "lucide-react";

interface SectionTemplateCardProps {
  template: SectionTemplate;
  onDragStart: (template: SectionTemplate) => void;
  onSectionAdded?: () => void;
}

export const SectionTemplateCard: React.FC<SectionTemplateCardProps> = ({
  template,
  onDragStart,
  onSectionAdded,
}) => {
  const { addSection } = useBuilderActions();
  const IconComponent = Icons[
    template.icon as keyof typeof Icons
  ] as React.ComponentType<{ size?: number; className?: string }>;

  console.log("SectionTemplateCard rendered for template:", template.name);

  const handleDragStart = (event: React.DragEvent) => {
    console.log("Drag started for template:", template.name);
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "template",
        templateId: template.id,
      })
    );
    onDragStart(template);
  };

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Quick add clicked for template:", template.name);
    addSection(template.id);

    // Call the callback if provided (for mobile auto-minimize)
    if (onSectionAdded) {
      onSectionAdded();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        className="group relative bg-white rounded-lg border border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition-all duration-200 section-template-card"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              {IconComponent && (
                <IconComponent size={20} className="text-blue-600" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {template.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {template.description}
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  template.category === "layout"
                    ? "bg-green-100 text-green-800"
                    : template.category === "content"
                    ? "bg-blue-100 text-blue-800"
                    : template.category === "media"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {template.category}
              </span>

              {/* Mobile Plus Button - Integrated */}
              <motion.button
                onClick={handleQuickAdd}
                className="lg:hidden bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add to canvas"
              >
                <Icons.Plus size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Desktop Action Buttons - Only visible on large screens */}
        <div className="hidden lg:block absolute top-2 right-2">
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Desktop Quick Add Button */}
            <motion.button
              onClick={handleQuickAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-1.5 transition-all duration-200 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Add to canvas"
            >
              <Icons.Plus size={14} />
            </motion.button>

            {/* Drag indicator */}
            <div className="bg-gray-100 rounded p-1">
              <Icons.GripVertical size={12} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
