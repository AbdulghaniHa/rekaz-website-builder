import React from "react";
import { BuilderSidebar } from "@/components/builder/builder-sidebar";
import { Canvas } from "@/components/builder/canvas";
import { HierarchySidebar } from "@/components/builder/hierarchy-sidebar";
import { PropertiesPanel } from "@/components/builder/properties-panel";

export const DesktopLayout: React.FC = () => {

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
