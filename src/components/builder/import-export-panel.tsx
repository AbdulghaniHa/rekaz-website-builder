"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { useBuilder } from "@/contexts/builder-context";
import {
  downloadPageConfiguration,
  importFromFile,
  PageConfiguration,
} from "@/lib/import-export";
import * as Icons from "lucide-react";

interface ImportExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, importSections, clearAllSections } = useBuilder();
  const [pageName, setPageName] = useState("My Website");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log("ImportExportPanel rendered, isOpen:", isOpen);

  const handleExport = () => {
    console.log("Exporting page configuration");
    try {
      downloadPageConfiguration(state.sections, pageName);
      setImportSuccess(
        `Successfully exported ${state.sections.length} sections!`
      );
      setImportError(null);
      setTimeout(() => setImportSuccess(null), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setImportError(error instanceof Error ? error.message : "Export failed");
      setImportSuccess(null);
    }
  };

  const handleImportClick = () => {
    console.log("Opening file dialog for import");
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected for import:", file.name);
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const config: PageConfiguration = await importFromFile(file);
      console.log(
        "Import successful, loading sections:",
        config.sections.length
      );

      importSections(config.sections);
      setPageName(config.name);
      setImportSuccess(
        `Successfully imported "${config.name}" with ${config.sections.length} sections!`
      );

      setTimeout(() => {
        setImportSuccess(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Import error:", error);
      setImportError(error instanceof Error ? error.message : "Import failed");
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearAll = () => {
    console.log("Clearing all sections");
    if (
      window.confirm(
        "Are you sure you want to clear all sections? This action cannot be undone."
      )
    ) {
      clearAllSections();
      setImportSuccess("All sections cleared!");
      setTimeout(() => setImportSuccess(null), 2000);
    }
  };

  // Custom overlay with blur backdrop
  const BlurOverlay = React.forwardRef<
    React.ElementRef<typeof DialogOverlay>,
    React.ComponentPropsWithoutRef<typeof DialogOverlay>
  >(({ className, ...props }, ref) => (
    <DialogOverlay
      ref={ref}
      className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      {...props}
    />
  ));
  BlurOverlay.displayName = "BlurOverlay";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <BlurOverlay />
        <DialogContent className="max-w-md w-full" showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.Download size={20} className="text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Import / Export
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Save or load your page configuration
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Export Section */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Icons.Upload size={16} className="mr-2 text-blue-600" />
                Export Configuration
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Download your current page design as a JSON file
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Name
                  </label>
                  <Input
                    type="text"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="Enter page name"
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icons.FileText size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {state.sections.length} sections
                      </p>
                      <p className="text-xs text-gray-500">Ready to export</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleExport}
                    disabled={state.sections.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Icons.Download size={16} className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Import Section */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Icons.Download size={16} className="mr-2 text-green-600" />
                Import Configuration
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Load a previously exported page configuration
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleImportClick}
                  disabled={isImporting}
                  variant="outline"
                  className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 py-8"
                >
                  {isImporting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      Importing...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Icons.Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm font-medium">
                        Click to select JSON file
                      </span>
                      <span className="text-xs text-gray-500">
                        or drag and drop here
                      </span>
                    </div>
                  )}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Clear All Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Icons.Trash2 size={16} className="mr-2 text-red-600" />
                Clear All Sections
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Remove all sections from the current page
              </p>
              <Button
                onClick={handleClearAll}
                disabled={state.sections.length === 0}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Icons.Trash2 size={16} className="mr-2" />
                Clear All ({state.sections.length} sections)
              </Button>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {importError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <Icons.AlertCircle
                      size={16}
                      className="text-red-600 mr-2"
                    />
                    <p className="text-sm text-red-700">{importError}</p>
                  </div>
                </motion.div>
              )}

              {importSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <Icons.CheckCircle
                      size={16}
                      className="text-green-600 mr-2"
                    />
                    <p className="text-sm text-green-700">{importSuccess}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
