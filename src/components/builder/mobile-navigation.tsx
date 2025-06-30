"use client";

import React from "react";
import { motion } from "motion/react";
import { Monitor, Package, Layers3, Settings, Download } from "lucide-react";
import { useBuilderStore } from "@/stores/builder-store";

interface MobileNavigationProps {
  activeTab: "canvas" | "components" | "hierarchy" | "properties" | "export";
  onTabChange: (
    tab: "canvas" | "components" | "hierarchy" | "properties" | "export"
  ) => void;
  isPanelOpen: boolean;
}

const tabConfig = [
  {
    id: "canvas" as const,
    label: "Canvas",
    icon: Monitor,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "components" as const,
    label: "Components",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "hierarchy" as const,
    label: "Structure",
    icon: Layers3,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "properties" as const,
    label: "Properties",
    icon: Settings,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    id: "export" as const,
    label: "Export",
    icon: Download,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange,
  isPanelOpen,
}) => {
  const sections = useBuilderStore((state) => state.sections);
  const selectedSectionId = useBuilderStore((state) => state.selectedSectionId);
  return (
    <div className="mobile-navigation-container">
      <div className="bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom mobile-no-select">
        <div className="flex items-center justify-around">
          {tabConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;

            // Special badge logic
            const showBadge = tab.id === "hierarchy" && sections.length > 0;
            const showSelectedBadge =
              tab.id === "properties" && selectedSectionId;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 min-w-[60px] mobile-tap-target ${
                  isActive
                    ? `${tab.bgColor} ${tab.color}`
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  duration: 0.1,
                }}
              >
                {/* Active Tab Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 opacity-10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon with Animation */}
                <motion.div
                  className="relative"
                  animate={{
                    scale: isActive ? 1.08 : 1,
                  }}
                  transition={{
                    scale: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      duration: 0.15,
                    },
                  }}
                >
                  <IconComponent
                    size={20}
                    className={`transition-colors duration-150 ${
                      isActive ? "drop-shadow-sm" : ""
                    }`}
                  />

                  {/* Badge for sections count */}
                  {showBadge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                    >
                      {sections.length}
                    </motion.div>
                  )}

                  {/* Badge for selected section */}
                  {showSelectedBadge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-3 h-3 shadow-lg"
                    />
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  className={`text-xs font-medium mt-1 transition-all duration-150 ${
                    isActive ? "font-semibold" : ""
                  }`}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    opacity: isActive ? 1 : 0.8,
                  }}
                  transition={{
                    scale: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      duration: 0.15,
                    },
                    opacity: { duration: 0.15 },
                  }}
                >
                  {tab.label}
                </motion.span>

                {/* Panel Open Indicator */}
                {isPanelOpen && isActive && tab.id !== "canvas" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-2 w-2 h-2 bg-current rounded-full opacity-60"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Bottom indicator bar */}
        <motion.div
          className="mt-2 mx-auto bg-gray-300 rounded-full"
          style={{ width: 134, height: 5 }}
          animate={{ opacity: isPanelOpen ? 0.3 : 0.6 }}
        />
      </div>
    </div>
  );
};
