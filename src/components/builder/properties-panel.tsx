"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBuilderStore } from "@/stores/builder-store";
import { getSectionTemplate } from "@/lib/section-templates";
import { usePropertiesPanelStore } from "@/stores/properties-panel-store";
import { Link, Plus, X, Settings, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyFieldProps {
  label: string;
  value: any;
  type: "text" | "textarea" | "boolean" | "array" | "url" | "color" | "select";
  onChange: (value: any) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const PropertyField: React.FC<PropertyFieldProps> = ({
  label,
  value,
  type,
  onChange,
  placeholder,
  options,
}) => {
  switch (type) {
    case "select":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={placeholder || `Select ${label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
          />
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Switch checked={value || false} onCheckedChange={onChange} />
        </div>
      );

    case "array":
      const arrayValue = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    onChange(newArray);
                  }}
                  placeholder={`${label} ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    onChange(newArray);
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([...arrayValue, ""])}
              className="w-full"
            >
              <Plus size={14} className="mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      );

    case "url":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <div className="relative">
            <Link
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "https://example.com"}
              className="pl-10"
            />
          </div>
        </div>
      );

    case "color":
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      );
  }
};

export const PropertiesPanel: React.FC = () => {
  const sections = useBuilderStore((state) => state.sections);
  const selectedSectionId = useBuilderStore((state) => state.selectedSectionId);
  const updateSection = useBuilderStore((state) => state.updateSection);
  const selectSection = useBuilderStore((state) => state.selectSection);
  const { isCollapsed, toggleCollapsed } = usePropertiesPanelStore();

  const selectedSection = sections.find(
    (section) => section.id === selectedSectionId
  );

  const template = selectedSection
    ? getSectionTemplate(selectedSection.templateId)
    : null;

  if (!selectedSection || !template) {
    return (
      <motion.div
        initial={{ width: 60, opacity: 1 }}
        animate={{ width: isCollapsed ? 60 : 320, opacity: 1 }}
        exit={{ width: 60, opacity: 1 }}
        className="bg-white border-l border-gray-200 flex flex-col"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-semibold text-gray-900"
                >
                  Properties
                </motion.h3>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              title={
                isCollapsed
                  ? "Expand Properties Panel"
                  : "Collapse Properties Panel"
              }
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex-1 flex items-center justify-center p-8"
            >
              <div className="text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MousePointer size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Section Selected
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Select a section from the page structure to edit its
                  properties
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
    // First check if template has custom property labels
    if (template?.propertyLabels?.[key]) {
      return template.propertyLabels[key];
    }

    // Fallback to automatic generation with improved regex
    const label = key
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Handle sequences like "CTA" -> "CTA "
      .replace(/([a-z\d])([A-Z])/g, "$1 $2") // Handle camelCase like "showButton" -> "show Button"
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
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

  const IconComponent = template.icon as React.ElementType;

  return (
    <motion.div
      initial={{ width: 60, opacity: 1 }}
      animate={{ width: isCollapsed ? 60 : 320, opacity: 1 }}
      exit={{ width: 60, opacity: 1 }}
      className="bg-white border-l border-gray-200 flex flex-col"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  {IconComponent && (
                    <IconComponent size={16} className="text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Properties</h3>
                  <p className="text-xs text-gray-500">{template.name}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            title={
              isCollapsed
                ? "Expand Properties Panel"
                : "Collapse Properties Panel"
            }
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>

      {/* Properties Form */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-4 space-y-6">
              {/* Section Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Section Info</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {template.category}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Dynamic Properties */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Content Properties
                </h4>
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
                      onChange={(newValue) =>
                        handlePropertyChange(key, newValue)
                      }
                      placeholder={placeholder}
                      options={options}
                    />
                  );
                })}
              </div>

              <Separator />

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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
