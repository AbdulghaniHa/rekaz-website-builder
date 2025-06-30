import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { BuilderSection, BuilderState } from "@/types/builder";
import { getSectionTemplate } from "@/lib/section-templates";

interface BuilderStore extends BuilderState {
  // Actions
  addSection: (templateId: string) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, props: Record<string, any>) => void;
  reorderSections: (dragIndex: number, dropIndex: number) => void;
  setSectionsOrder: (sections: BuilderSection[]) => void;
  selectSection: (sectionId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  importSections: (sections: BuilderSection[]) => void;
}

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      sections: [],
      selectedSectionId: null,
      isDragging: false,

      // Actions
      addSection: (templateId) => {
        const template = getSectionTemplate(templateId);
        if (!template) {
          console.warn("Template not found:", templateId);
          return;
        }

        const { sections } = get();
        const newSection: BuilderSection = {
          id: new Date().getTime().toString(),
          templateId,
          props: { ...template.defaultProps },
          order: sections.length,
        };

        set({ sections: [...sections, newSection] }, false, "addSection");
      },

      removeSection: (sectionId) => {
        const { sections, selectedSectionId } = get();
        set(
          {
            sections: sections.filter((section) => section.id !== sectionId),
            selectedSectionId:
              selectedSectionId === sectionId ? null : selectedSectionId,
          },
          false,
          "removeSection"
        );
      },

      updateSection: (sectionId, props) => {
        const { sections } = get();
        set(
          {
            sections: sections.map((section) =>
              section.id === sectionId
                ? { ...section, props: { ...section.props, ...props } }
                : section
            ),
          },
          false,
          "updateSection"
        );
      },

      reorderSections: (dragIndex, dropIndex) => {
        const { sections } = get();
        const newSections = [...sections];
        const [draggedSection] = newSections.splice(dragIndex, 1);
        newSections.splice(dropIndex, 0, draggedSection);

        const reorderedSections = newSections.map((section, index) => ({
          ...section,
          order: index,
        }));

        set({ sections: reorderedSections }, false, "reorderSections");
      },

      setSectionsOrder: (sections) => {
        const sectionsWithOrder = sections.map((section, index) => ({
          ...section,
          order: index,
        }));
        set({ sections: sectionsWithOrder }, false, "setSectionsOrder");
      },

      selectSection: (sectionId) => {
        set({ selectedSectionId: sectionId }, false, "selectSection");
      },

      setDragging: (isDragging) => {
        set({ isDragging }, false, "setDragging");
      },

      importSections: (sections) => {
        const sectionsWithOrder = sections.map((section, index) => ({
          ...section,
          order: index,
        }));
        set(
          {
            sections: sectionsWithOrder,
            selectedSectionId: null,
            isDragging: false,
          },
          false,
          "importSections"
        );
      },
    }),
    { name: "builder-store" }
  )
);
