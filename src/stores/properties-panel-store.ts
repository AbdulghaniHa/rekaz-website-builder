import { create } from "zustand";

interface PropertiesPanelState {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

export const usePropertiesPanelStore = create<PropertiesPanelState>((set) => {
  return {
    isCollapsed: true,
    setCollapsed: (collapsed: boolean) => {
      set({ isCollapsed: collapsed });
    },
    toggleCollapsed: () => {
      set((state) => ({ isCollapsed: !state.isCollapsed }));
    },
  };
});
