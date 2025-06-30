export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "layout" | "content" | "media" | "navigation";
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
  propertyLabels?: Record<string, string>;
}

export interface BuilderSection {
  id: string;
  templateId: string;
  props: Record<string, any>;
  order: number;
}

export interface BuilderState {
  sections: BuilderSection[];
  selectedSectionId: string | null;
  isDragging: boolean;
}

export interface DragData {
  type: "template" | "section";
  templateId?: string;
  sectionId?: string;
}
