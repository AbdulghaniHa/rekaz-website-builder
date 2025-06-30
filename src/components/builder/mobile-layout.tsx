"use client";

import React, { useState } from "react";
import { Canvas } from "@/components/builder/canvas";
import { BuilderSidebar } from "@/components/builder/builder-sidebar";
import { HierarchySidebar } from "@/components/builder/hierarchy-sidebar";
import { MobilePropertiesPanel } from "@/components/builder/mobile-properties-panel";
import { MobileNavigation } from "@/components/builder/mobile-navigation";
import { ImportExportPanel } from "@/components/builder/import-export-panel";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import * as Icons from "lucide-react";

export const MobileLayout: React.FC = () => {
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
