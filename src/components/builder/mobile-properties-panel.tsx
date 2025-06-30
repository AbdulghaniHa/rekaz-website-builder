"use client";

import React from "react";
import { useBuilderStore } from "@/stores/builder-store";
import { getSectionTemplate } from "@/lib/section-templates";
import { PropertyField } from "./property-field";
import { Button } from "@/components/ui/button";
import { MousePointer, X } from "lucide-react";

interface PropertyFieldProps {
  label: string;
  value: any;
  type: "text" | "textarea" | "boolean" | "array" | "url" | "color" | "select";
  onChange: (value: any) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const MobilePropertiesPanel: React.FC = () => {
  const sections = useBuilderStore((state) => state.sections);
  const selectedSectionId = useBuilderStore((state) => state.selectedSectionId);
  const updateSection = useBuilderStore((state) => state.updateSection);
  const selectSection = useBuilderStore((state) => state.selectSection);

  const selectedSection = sections.find(
    (section) => section.id === selectedSectionId
  );

  const template = selectedSection
    ? getSectionTemplate(selectedSection.templateId)
    : null;

  if (!selectedSection || !template) {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MousePointer size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Section Selected
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Select a section from the page structure to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    updateSection(selectedSection.id, { [key]: value });
  };

  const getPropertyType = (
    key: string,
    value: any
  ): PropertyFieldProps["type"] => {
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) return "array";
    if (key.toLowerCase() === "layout") return "select";
    if (
      key.toLowerCase().includes("url") ||
      key.toLowerCase().includes("image")
    )
      return "url";
    if (key.toLowerCase().includes("color")) return "color";
    if (
      key.toLowerCase().includes("content") ||
      key.toLowerCase().includes("description")
    )
      return "textarea";
    return "text";
  };

  const getPropertyOptions = (
    key: string
  ): { value: string; label: string }[] | undefined => {
    if (key.toLowerCase() === "layout") {
      return [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "center", label: "Centered" },
      ];
    }
    return undefined;
  };

  const getPropertyLabel = (key: string): string => {
    if (template?.propertyLabels?.[key]) {
      return template.propertyLabels[key];
    }
    const label = key
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/([a-z\d])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
    return label;
  };

  const getPropertyPlaceholder = (
    key: string,
    type: PropertyFieldProps["type"]
  ): string => {
    switch (type) {
      case "url":
        return "https://example.com/image.jpg";
      case "textarea":
        return "Enter your content here...";
      default:
        return `Enter ${getPropertyLabel(key).toLowerCase()}`;
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Section Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Section Info</h4>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Type:</span>
            <span className="font-medium text-gray-900 capitalize">
              {template.category}
            </span>
          </div>
        </div>

        {/* Dynamic Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Content Properties</h4>
          {Object.entries(selectedSection.props).map(([key, value]) => {
            const type = getPropertyType(key, value);
            const label = getPropertyLabel(key);
            const placeholder = getPropertyPlaceholder(key, type);
            const options = getPropertyOptions(key);

            return (
              <PropertyField
                key={key}
                label={label}
                value={value}
                type={type}
                onChange={(newValue: any) =>
                  handlePropertyChange(key, newValue)
                }
                placeholder={placeholder}
                options={options}
              />
            );
          })}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => selectSection(null)}
            className="w-full"
          >
            <X size={16} className="mr-2" />
            Deselect Section
          </Button>
        </div>
      </div>
    </div>
  );
};
