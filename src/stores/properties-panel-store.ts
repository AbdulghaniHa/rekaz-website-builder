import { create } from "zustand";

interface PropertiesPanelState {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

export const usePropertiesPanelStore = create<PropertiesPanelState>((set) => {
  console.log("PropertiesPanelStore initialized");

  return {
    isCollapsed: true,
    setCollapsed: (collapsed: boolean) => {
      console.log("Setting Properties Panel collapsed state to:", collapsed);
      set({ isCollapsed: collapsed });
    },
    toggleCollapsed: () => {
      console.log("Toggling Properties Panel collapsed state");
      set((state) => ({ isCollapsed: !state.isCollapsed }));
    },
  };
});
