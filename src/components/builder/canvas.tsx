"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/contexts/builder-context";
import { getSectionTemplate } from "@/lib/section-templates";
import { DragData } from "@/types/builder";
import { ImportExportPanel } from "./import-export-panel";
import * as Icons from "lucide-react";

export const Canvas: React.FC = () => {
  const { state, addSection, selectSection, setDragging } = useBuilder();
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  console.log("Canvas rendered with sections:", state.sections.length);

  const handleImportExportToggle = () => {
    console.log("Toggling import/export panel from canvas");
    setIsImportExportOpen(!isImportExportOpen);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    // Only set dragging to false if we're leaving the canvas completely
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);

    try {
      const data: DragData = JSON.parse(
        event.dataTransfer.getData("application/json")
      );
      console.log("Drop event with data:", data);

      if (data.type === "template" && data.templateId) {
        console.log("Adding section from template:", data.templateId);
        addSection(data.templateId);
      }
    } catch (error) {
      console.error("Error parsing drop data:", error);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    console.log("Section clicked:", sectionId);
    selectSection(sectionId);
  };

  return (
    <div className="flex-1 h-screen bg-white lg:border-l lg:border-r border-gray-200 relative flex flex-col">
      {/* Canvas Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Live Preview
            </h2>
            <p className="text-sm text-gray-500">
              {state.sections.length === 0
                ? "Drop sections here to start building"
                : `${state.sections.length} section${
                    state.sections.length === 1 ? "" : "s"
                  } added`}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {state.sections.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Live preview</span>
              </div>
            )}

            {/* Import/Export Button - Hidden on mobile */}
            <Button
              onClick={handleImportExportToggle}
              size="sm"
              variant="outline"
              className="hidden lg:inline-flex"
            >
              <Icons.Download size={16} className="mr-2" />
              Import/Export
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-200 ${
          state.isDragging
            ? "bg-blue-50 border-2 border-dashed border-blue-300"
            : "bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {state.sections.length === 0 ? (
          // Empty State
          <div className="h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto p-8"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.MousePointer2 size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Start Building Your Website
              </h3>
              <p className="text-gray-500 mb-6">
                Drag sections from the left sidebar and drop them here to start
                creating your website. You'll see a live preview of your changes
                instantly.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Icons.ArrowLeft size={16} />
                <span>Drag from sidebar</span>
                <Icons.ArrowRight size={16} />
                <span>Drop here</span>
              </div>
            </motion.div>
          </div>
        ) : (
          // Sections Preview - Full Width Layout
          <div className="min-h-full">
            <AnimatePresence>
              {state.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => {
                  const template = getSectionTemplate(section.templateId);
                  if (!template) {
                    console.warn("Template not found for section:", section);
                    return null;
                  }

                  const SectionComponent = template.component;
                  const isSelected = state.selectedSectionId === section.id;

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`relative group cursor-pointer transition-all duration-200 w-full z-0 ${
                        isSelected ? "ring-2 ring-gray-300 ring-opacity-50" : ""
                      }`}
                      onClick={() => handleSectionClick(section.id)}
                    >
                      {/* Section Overlay */}
                      <div className="absolute inset-0 transition-all duration-200 z-0" />

                      {/* Section Label */}
                      <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                          {template.name}
                        </div>
                      </div>

                      {/* Section Content - Full Width */}
                      <div className="w-full z-10 relative">
                        <SectionComponent {...section.props} />
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        )}

        {/* Drop Zone Indicator */}
        {state.isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-4 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="text-center">
              <Icons.Plus size={48} className="text-blue-400 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Drop section here</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Import/Export Panel */}
      <ImportExportPanel
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />
    </div>
  );
};
