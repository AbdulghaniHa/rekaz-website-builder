import React from "react";
import { BuilderProvider } from "@/contexts/builder-context";
import { MobileLayout } from "@/components/builder/mobile-layout";
import { DesktopLayout } from "@/components/builder/desktop-layout";

export default function Home() {
  return (
    <BuilderProvider>
      <div className="lg:hidden">
        <MobileLayout />
      </div>

      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </BuilderProvider>
  );
};
