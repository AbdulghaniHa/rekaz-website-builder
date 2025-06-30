import React from "react";
import { MobileLayout } from "@/components/builder/mobile-layout";
import { DesktopLayout } from "@/components/builder/desktop-layout";

export default function Home() {
  return (
    <div>
      <div className="lg:hidden">
        <MobileLayout />
      </div>

      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </div>
  );
}
