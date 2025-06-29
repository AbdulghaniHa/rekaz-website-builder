"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBuilder } from "@/contexts/builder-context";
import { getSectionTemplate } from "@/lib/section-templates";
import * as Icons from "lucide-react";

export const HierarchySidebar: React.FC = () => {
  const { state, removeSection, selectSection, reorderSections } = useBuilder();
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  console.log(
    "HierarchySidebar rendered with sections:",
    state.sections.length
  );

  const handleSectionClick = (sectionId: string) => {
    console.log("Hierarchy section clicked:", sectionId);
    selectSection(sectionId);
  };

  const handleDeleteSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Deleting section:", sectionId);
    removeSection(sectionId);
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    console.log("Hierarchy drag start:", index);
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", index.toString());
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      console.log("Reordering from", draggedIndex, "to", dropIndex);
      reorderSections(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const sortedSections = [...state.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="w-80 h-full bg-gray-50 border-l border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Page Structure
          </h2>
          {state.sections.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {state.sections.length}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {state.sections.length === 0
            ? "No sections added yet"
            : "Click to select, drag to reorder"}
        </p>
      </div>

      {/* Hierarchy List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedSections.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Icons.Layers size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm mb-2">No sections yet</p>
            <p className="text-gray-400 text-xs">
              Add sections from the left sidebar to see them here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {sortedSections.map((section, index) => {
                const template = getSectionTemplate(section.templateId);
                if (!template) return null;

                const isSelected = state.selectedSectionId === section.id;
                const IconComponent = Icons[
                  template.icon as keyof typeof Icons
                ] as React.ComponentType<{ size?: number; className?: string }>;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative bg-white rounded-lg border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-blue-300 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleSectionClick(section.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {/* Drag Handle */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                            <Icons.GripVertical
                              size={14}
                              className="text-gray-400"
                            />
                          </div>

                          {/* Section Icon */}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? "bg-blue-200" : "bg-gray-100"
                            }`}
                          >
                            {IconComponent && (
                              <IconComponent
                                size={16}
                                className={
                                  isSelected ? "text-blue-700" : "text-gray-600"
                                }
                              />
                            )}
                          </div>

                          {/* Section Info */}
                          <div className="min-w-0 flex-1">
                            <h3
                              className={`text-sm font-medium truncate ${
                                isSelected ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              {template.name}
                            </h3>
                            <p
                              className={`text-xs truncate ${
                                isSelected ? "text-blue-700" : "text-gray-500"
                              }`}
                            >
                              {template.category}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleDeleteSection(section.id, e)}
                            className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete section"
                          >
                            <Icons.Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Order indicator */}
                      <div className="absolute top-1 left-1">
                        <span
                          className={`text-xs font-mono ${
                            isSelected ? "text-blue-600" : "text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">
            {state.sections.length > 0
              ? `${state.sections.length} section${
                  state.sections.length === 1 ? "" : "s"
                } in your page`
              : "Your page structure will appear here"}
          </p>
          {state.selectedSectionId && (
            <div className="flex items-center justify-center mt-2 space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-blue-600">Section selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
