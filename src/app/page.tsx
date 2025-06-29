"use client";

import React from "react";
import { BuilderProvider } from "@/contexts/builder-context";
import { BuilderSidebar } from "@/components/builder/builder-sidebar";
import { Canvas } from "@/components/builder/canvas";
import { HierarchySidebar } from "@/components/builder/hierarchy-sidebar";
import { PropertiesPanel } from "@/components/builder/properties-panel";

export default function Home() {
  console.log("Home page rendered with new three-column layout");

  return (
    <BuilderProvider>
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
    </BuilderProvider>
  );
}
