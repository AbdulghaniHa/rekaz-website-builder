export interface SectionComponent {
  id: string;
  name: string;
  category: "header" | "hero" | "content" | "footer" | "other";
  icon: string;
  description: string;
  thumbnail?: string;
  defaultProps?: Record<string, any>;
}

export interface BuilderSection {
  id: string;
  componentId: string;
  props: Record<string, any>;
  order: number;
}

export interface PageConfig {
  id: string;
  name: string;
  sections: BuilderSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DragItem {
  type: "section";
  componentId: string;
  id?: string; // For existing sections
  isNew?: boolean; // For new sections from sidebar
}
