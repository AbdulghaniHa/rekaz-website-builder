import { BuilderSection } from "@/types/builder";

export interface PageConfiguration {
  version: string;
  name: string;
  sections: BuilderSection[];
  exportedAt: string;
  metadata?: {
    totalSections: number;
    templateIds: string[];
  };
}

/**
 * Export page configuration to JSON
 */
export const exportPageConfiguration = (
  sections: BuilderSection[],
  pageName: string = "Untitled Page"
): PageConfiguration => {
  console.log("Exporting page configuration with", sections.length, "sections");

  const templateIds = [...new Set(sections.map((s) => s.templateId))];

  const config: PageConfiguration = {
    version: "1.0.0",
    name: pageName,
    sections: sections.map((section) => ({
      ...section,
      // Ensure order is set correctly
      order: section.order,
    })),
    exportedAt: new Date().toISOString(),
    metadata: {
      totalSections: sections.length,
      templateIds,
    },
  };

  console.log("Page configuration exported:", config);
  return config;
};

/**
 * Download page configuration as JSON file
 */
export const downloadPageConfiguration = (
  sections: BuilderSection[],
  pageName: string = "Untitled Page"
): void => {
  console.log("Downloading page configuration as JSON file");

  try {
    const config = exportPageConfiguration(sections, pageName);
    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pageName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_${Date.now()}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    console.log("Page configuration downloaded successfully");
  } catch (error) {
    console.error("Error downloading page configuration:", error);
    throw new Error("Failed to download page configuration");
  }
};

/**
 * Validate imported page configuration
 */
export const validatePageConfiguration = (data: any): PageConfiguration => {
  console.log("Validating imported page configuration");

  if (!data || typeof data !== "object") {
    throw new Error("Invalid configuration file: Not a valid JSON object");
  }

  if (!data.version) {
    throw new Error("Invalid configuration file: Missing version");
  }

  if (!data.sections || !Array.isArray(data.sections)) {
    throw new Error(
      "Invalid configuration file: Missing or invalid sections array"
    );
  }

  // Validate each section
  for (const section of data.sections) {
    if (!section.id || typeof section.id !== "string") {
      throw new Error("Invalid section: Missing or invalid ID");
    }
    if (!section.templateId || typeof section.templateId !== "string") {
      throw new Error("Invalid section: Missing or invalid template ID");
    }
    if (!section.props || typeof section.props !== "object") {
      throw new Error("Invalid section: Missing or invalid props");
    }
    if (typeof section.order !== "number") {
      throw new Error("Invalid section: Missing or invalid order");
    }
  }

  console.log("Page configuration validation successful");
  return data as PageConfiguration;
};

/**
 * Import page configuration from JSON
 */
export const importPageConfiguration = (
  jsonString: string
): PageConfiguration => {
  console.log("Importing page configuration from JSON");

  try {
    const data = JSON.parse(jsonString);
    return validatePageConfiguration(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON parsing error:", error);
      throw new Error("Invalid JSON file format");
    }
    throw error;
  }
};

/**
 * Import page configuration from file
 */
export const importFromFile = (file: File): Promise<PageConfiguration> => {
  console.log("Importing page configuration from file:", file.name);

  return new Promise((resolve, reject) => {
    if (!file.type.includes("json") && !file.name.endsWith(".json")) {
      reject(new Error("Please select a valid JSON file"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const config = importPageConfiguration(jsonString);
        console.log("File import successful:", config.name);
        resolve(config);
      } catch (error) {
        console.error("File import error:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      console.error("File reading error");
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};
