"use client";

import React from "react";
import { motion, Reorder } from "motion/react";
import { useBuilder } from "@/contexts/builder-context";
import { usePropertiesPanelStore } from "@/stores/properties-panel-store";
import { getSectionTemplate } from "@/lib/section-templates";
import * as Icons from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HierarchySidebarProps {
  onEditPropertiesMobile?: (sectionId: string) => void;
}

export const HierarchySidebar: React.FC<HierarchySidebarProps> = ({
  onEditPropertiesMobile,
}) => {
  const { state, removeSection, selectSection, setSectionsOrder } =
    useBuilder();
  const { setCollapsed } = usePropertiesPanelStore();

  console.log(
    "HierarchySidebar rendered with sections:",
    state.sections.length
  );

  const handleSectionClick = (sectionId: string) => {
    console.log("Hierarchy section clicked:", sectionId);
    selectSection(sectionId);
  };

  const handleEditSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Editing section:", sectionId);
    selectSection(sectionId);

    // If we have a mobile callback, use it (for mobile drawer behavior)
    if (onEditPropertiesMobile) {
      onEditPropertiesMobile(sectionId);
    } else {
      // Desktop behavior - expand the Properties Panel
      setCollapsed(false);
    }
  };

  const handleDeleteSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Deleting section:", sectionId);
    removeSection(sectionId);
  };

  const sortedSections = [...state.sections].sort((a, b) => a.order - b.order);

  const handleReorder = (newOrder: typeof sortedSections) => {
    console.log(
      "Reordering sections - new order received:",
      newOrder.map((s) => s.id)
    );
    setSectionsOrder(newOrder);
  };

  return (
    <div className="w-full lg:w-80 h-full bg-white lg:border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Page Structure
          </h2>
          {state.sections.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {state.sections.length}
            </motion.div>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {state.sections.length === 0
            ? "No sections added yet"
            : "Click to select • Drag to reorder • Hover for actions"}
        </p>
      </div>

      {/* Hierarchy List */}
      <div className="flex-1 overflow-y-auto">
        {sortedSections.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6"
          >
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Icons.Layers size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sections yet
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Add sections from the left sidebar to start building your page
              structure
            </p>
          </motion.div>
        ) : (
          <div className="p-4">
            <Reorder.Group
              as="div"
              axis="y"
              values={sortedSections}
              onReorder={handleReorder}
              className="space-y-3 list-none"
            >
              {sortedSections.map((section, index) => {
                const template = getSectionTemplate(section.templateId);
                if (!template) return null;

                const isSelected = state.selectedSectionId === section.id;
                const IconComponent = Icons[
                  template.icon as keyof typeof Icons
                ] as React.ComponentType<{ size?: number; className?: string }>;

                return (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    className="group relative list-none rounded-xl"
                    style={{ position: "relative", listStyle: "none" }}
                    whileDrag={{
                      scale: 1.025,
                      zIndex: 50,
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      className={`relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-blue-400 bg-blue-50 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      onClick={() => handleSectionClick(section.id)}
                      layout
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <motion.div
                          layoutId="selection-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}

                      <div className="p-4 rounded-xl">
                        <div className="flex items-center space-x-4">
                          {/* Drag Handle */}
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icons.GripVertical
                              size={18}
                              className="text-gray-400 hover:text-gray-600"
                            />
                          </motion.div>

                          {/* Section Icon */}
                          <motion.div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-blue-200 text-blue-700"
                                : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {IconComponent && <IconComponent size={20} />}
                          </motion.div>

                          {/* Section Info */}
                          <div className="min-w-0 flex-1">
                            <h3
                              className={`text-base font-medium truncate ${
                                isSelected ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              {template.name}
                            </h3>
                            <p
                              className={`text-sm truncate ${
                                isSelected ? "text-blue-600" : "text-gray-500"
                              }`}
                            >
                              {template.category}
                            </p>
                          </div>

                          {/* Actions Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <motion.button
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all focus:outline-none"
                                title="Section actions"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Icons.MoreVertical size={16} className="text-gray-400 hover:text-gray-600" />
                              </motion.button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSection(section.id, e);
                                }}
                                className="cursor-pointer"
                              >
                                <Icons.Edit size={16} className="mr-2" />
                                Edit Properties
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSection(section.id, e);
                                }}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                              >
                                <Icons.Trash2 size={16} className="mr-2" />
                                Delete Section
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Drag overlay */}
                      <motion.div
                        className="absolute inset-0 bg-blue-500 opacity-0 pointer-events-none"
                        whileDrag={{ opacity: 0.1 }}
                      />
                    </motion.div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
        )}
      </div>

      {/* Footer */}
      <motion.div className="p-6 border-t border-gray-100 bg-gray-50" layout>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {state.sections.length > 0
              ? `${state.sections.length} section${
                  state.sections.length === 1 ? "" : "s"
                } in your page`
              : "Your page structure will appear here"}
          </p>
          {state.selectedSectionId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2"
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-sm text-blue-600 font-medium">
                Section selected
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
