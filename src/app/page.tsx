"use client";

import React, { useState, useEffect } from "react";
import { BuilderProvider } from "@/contexts/builder-context";
import { BuilderSidebar } from "@/components/builder/builder-sidebar";
import { Canvas } from "@/components/builder/canvas";
import { HierarchySidebar } from "@/components/builder/hierarchy-sidebar";
import { PropertiesPanel } from "@/components/builder/properties-panel";
import { MobileNavigation } from "@/components/builder/mobile-navigation";
import { ImportExportPanel } from "@/components/builder/import-export-panel";
import { useBuilder } from "@/contexts/builder-context";
import { getSectionTemplate } from "@/lib/section-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import * as Icons from "lucide-react";

// Property Field Component for Mobile
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
                  <Icons.X size={14} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([...arrayValue, ""])}
              className="w-full"
            >
              <Icons.Plus size={14} className="mr-2" />
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
            <Icons.Link
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

// Mobile Properties Panel Component (without collapse animations)
const MobilePropertiesPanel: React.FC = () => {
  const { state, updateSection, selectSection } = useBuilder();

  const selectedSection = state.sections.find(
    (section) => section.id === state.selectedSectionId
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
              <Icons.MousePointer size={32} className="text-gray-400" />
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
            <Icons.X size={16} className="mr-2" />
            Deselect Section
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mobile Layout Component
const MobileLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "canvas" | "components" | "hierarchy" | "properties" | "export"
  >("canvas");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  console.log("Mobile layout rendered with active tab:", activeTab);

  const handleTabChange = (tab: typeof activeTab) => {
    if (tab === "canvas") {
      setIsPanelOpen(false);
      setActiveTab(tab);
    } else if (tab === "export") {
      setIsImportExportOpen(true);
      setActiveTab(tab);
    } else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setActiveTab("canvas");
  };

  const handleImportExportClose = () => {
    setIsImportExportOpen(false);
    setActiveTab("canvas");
  };

  // Mobile callback for switching from hierarchy to properties
  const handleEditPropertiesMobile = (sectionId: string) => {
    console.log("Switching to properties tab for section:", sectionId);
    setActiveTab("properties");
    // Panel should stay open since we're switching tabs
  };

  // Mobile callback for auto-minimizing when section is added
  const handleSectionAddedMobile = () => {
    console.log("Section added in mobile, minimizing panel for better UX");
    setIsPanelOpen(false);
    setActiveTab("canvas");
  };

  const getDrawerTitle = () => {
    switch (activeTab) {
      case "components":
        return "Section Library";
      case "hierarchy":
        return "Page Structure";
      case "properties":
        return "Section Properties";
      default:
        return "Panel";
    }
  };

  const getDrawerDescription = () => {
    switch (activeTab) {
      case "components":
        return "Drag sections to the canvas or click + to add";
      case "hierarchy":
        return "View and organize your page structure";
      case "properties":
        return "Edit selected section properties";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 relative pb-20">
        <Canvas onSectionAdded={handleSectionAddedMobile} />
      </div>

      {/* Fixed Mobile Navigation - Always visible */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isPanelOpen={isPanelOpen}
      />

      {/* Mobile Panel Drawer with Blur Backdrop */}
      <Drawer open={isPanelOpen} onOpenChange={setIsPanelOpen}>
        <DrawerContent className="max-h-[80vh] mobile-drawer-content">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DrawerTitle className="text-lg font-semibold">
                  {getDrawerTitle()}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-500 mt-1">
                  {getDrawerDescription()}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Icons.X size={16} />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {activeTab === "components" && (
              <div className="h-full">
                <BuilderSidebar onSectionAdded={handleSectionAddedMobile} />
              </div>
            )}
            {activeTab === "hierarchy" && (
              <div className="h-full">
                <HierarchySidebar
                  onEditPropertiesMobile={handleEditPropertiesMobile}
                />
              </div>
            )}
            {activeTab === "properties" && (
              <div className="h-full">
                <MobilePropertiesPanel />
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Import/Export Dialog */}
      <ImportExportPanel
        isOpen={isImportExportOpen}
        onClose={handleImportExportClose}
      />
    </div>
  );
};

// Desktop Layout Component
const DesktopLayout: React.FC = () => {
  console.log("Desktop layout rendered with four-column layout");

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Left Sidebar - Section Library */}
      <BuilderSidebar />

      {/* Middle - Canvas Area (takes remaining space) */}
      <Canvas />

      {/* Right Sidebar - Page Hierarchy */}
      <HierarchySidebar />

      {/* Properties Panel - Section Editor */}
      <PropertiesPanel />
    </div>
  );
};

// Main Layout Wrapper
const ResponsiveLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default function Home() {
  console.log("Home page rendered with responsive layout");

  return (
    <BuilderProvider>
      <ResponsiveLayout />
    </BuilderProvider>
  );
}
