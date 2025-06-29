"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { BuilderSection, SectionTemplate, BuilderState } from "@/types/builder";
import { getSectionTemplate } from "@/lib/section-templates";

interface BuilderContextType {
  state: BuilderState;
  addSection: (templateId: string) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, props: Record<string, any>) => void;
  reorderSections: (dragIndex: number, dropIndex: number) => void;
  setSectionsOrder: (sections: BuilderSection[]) => void;
  selectSection: (sectionId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  importSections: (sections: BuilderSection[]) => void;
  clearAllSections: () => void;
}

type BuilderAction =
  | { type: "ADD_SECTION"; payload: { templateId: string } }
  | { type: "REMOVE_SECTION"; payload: { sectionId: string } }
  | {
      type: "UPDATE_SECTION";
      payload: { sectionId: string; props: Record<string, any> };
    }
  | {
      type: "REORDER_SECTIONS";
      payload: { dragIndex: number; dropIndex: number };
    }
  | { type: "SET_SECTIONS_ORDER"; payload: { sections: BuilderSection[] } }
  | { type: "SELECT_SECTION"; payload: { sectionId: string | null } }
  | { type: "SET_DRAGGING"; payload: { isDragging: boolean } }
  | { type: "IMPORT_SECTIONS"; payload: { sections: BuilderSection[] } }
  | { type: "CLEAR_ALL_SECTIONS" };

const generateId = () =>
  `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const builderReducer = (
  state: BuilderState,
  action: BuilderAction
): BuilderState => {
  console.log(
    "Builder reducer action:",
    action.type,
    "payload" in action ? action.payload : "no payload"
  );

  switch (action.type) {
    case "ADD_SECTION": {
      const template = getSectionTemplate(action.payload.templateId);
      if (!template) {
        console.warn("Template not found:", action.payload.templateId);
        return state;
      }

      const newSection: BuilderSection = {
        id: generateId(),
        templateId: action.payload.templateId,
        props: { ...template.defaultProps },
        order: state.sections.length,
      };

      console.log("Adding new section:", newSection);
      return {
        ...state,
        sections: [...state.sections, newSection],
      };
    }

    case "REMOVE_SECTION":
      console.log("Removing section:", action.payload.sectionId);
      return {
        ...state,
        sections: state.sections.filter(
          (section) => section.id !== action.payload.sectionId
        ),
        selectedSectionId:
          state.selectedSectionId === action.payload.sectionId
            ? null
            : state.selectedSectionId,
      };

    case "UPDATE_SECTION":
      console.log(
        "Updating section:",
        action.payload.sectionId,
        "with props:",
        action.payload.props
      );
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                props: { ...section.props, ...action.payload.props },
              }
            : section
        ),
      };

    case "REORDER_SECTIONS": {
      const { dragIndex, dropIndex } = action.payload;
      console.log("Reordering sections from", dragIndex, "to", dropIndex);

      const newSections = [...state.sections];
      const [draggedSection] = newSections.splice(dragIndex, 1);
      newSections.splice(dropIndex, 0, draggedSection);

      // Update order property
      const reorderedSections = newSections.map((section, index) => ({
        ...section,
        order: index,
      }));

      return {
        ...state,
        sections: reorderedSections,
      };
    }

    case "SET_SECTIONS_ORDER": {
      console.log(
        "Setting sections order with",
        action.payload.sections.length,
        "sections"
      );
      // Update order property based on array position
      const sectionsWithOrder = action.payload.sections.map(
        (section, index) => ({
          ...section,
          order: index,
        })
      );

      return {
        ...state,
        sections: sectionsWithOrder,
      };
    }

    case "SELECT_SECTION":
      console.log("Selecting section:", action.payload.sectionId);
      return {
        ...state,
        selectedSectionId: action.payload.sectionId,
      };

    case "SET_DRAGGING":
      return {
        ...state,
        isDragging: action.payload.isDragging,
      };

    case "IMPORT_SECTIONS": {
      console.log("Importing sections:", action.payload.sections.length);
      // Clear selection and reset dragging state when importing
      const sectionsWithOrder = action.payload.sections.map(
        (section, index) => ({
          ...section,
          order: index,
        })
      );

      return {
        ...state,
        sections: sectionsWithOrder,
        selectedSectionId: null,
        isDragging: false,
      };
    }

    case "CLEAR_ALL_SECTIONS":
      console.log("Clearing all sections");
      return {
        ...state,
        sections: [],
        selectedSectionId: null,
        isDragging: false,
      };

    default:
      return state;
  }
};

const initialState: BuilderState = {
  sections: [],
  selectedSectionId: null,
  isDragging: false,
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  console.log("BuilderProvider state:", state);

  const addSection = (templateId: string) => {
    dispatch({ type: "ADD_SECTION", payload: { templateId } });
  };

  const removeSection = (sectionId: string) => {
    dispatch({ type: "REMOVE_SECTION", payload: { sectionId } });
  };

  const updateSection = (sectionId: string, props: Record<string, any>) => {
    dispatch({ type: "UPDATE_SECTION", payload: { sectionId, props } });
  };

  const reorderSections = (dragIndex: number, dropIndex: number) => {
    dispatch({ type: "REORDER_SECTIONS", payload: { dragIndex, dropIndex } });
  };

  const setSectionsOrder = (sections: BuilderSection[]) => {
    dispatch({ type: "SET_SECTIONS_ORDER", payload: { sections } });
  };

  const selectSection = (sectionId: string | null) => {
    dispatch({ type: "SELECT_SECTION", payload: { sectionId } });
  };

  const setDragging = (isDragging: boolean) => {
    dispatch({ type: "SET_DRAGGING", payload: { isDragging } });
  };

  const importSections = (sections: BuilderSection[]) => {
    dispatch({ type: "IMPORT_SECTIONS", payload: { sections } });
  };

  const clearAllSections = () => {
    dispatch({ type: "CLEAR_ALL_SECTIONS" });
  };

  return (
    <BuilderContext.Provider
      value={{
        state,
        addSection,
        removeSection,
        updateSection,
        reorderSections,
        setSectionsOrder,
        selectSection,
        setDragging,
        importSections,
        clearAllSections,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
