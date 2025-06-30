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
      // setIsPanelOpen(false);
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

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <Canvas />

        {/* Mobile Panel Overlay */}
        {isPanelOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-40"
            onClick={handlePanelClose}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[70vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize">
                  {activeTab}
                </h3>
                <button
                  onClick={handlePanelClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Panel Content */}
              <div className="overflow-y-auto max-h-[calc(70vh-80px)] mobile-panel-scroll">
                {activeTab === "components" && (
                  <div className="h-full">
                    <BuilderSidebar />
                  </div>
                )}
                {activeTab === "hierarchy" && (
                  <div className="h-full">
                    <HierarchySidebar />
                  </div>
                )}
                {activeTab === "properties" && (
                  <div className="h-full">
                    <PropertiesPanel />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isPanelOpen={isPanelOpen}
      />

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
