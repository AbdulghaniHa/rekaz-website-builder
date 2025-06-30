"use client";

import { useState, useRef, forwardRef } from "react";
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
import { useBuilderStore } from "@/stores/builder-store";
import {
  downloadPageConfiguration,
  importFromFile,
  PageConfiguration,
} from "@/lib/import-export";
import {
  Download,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ImportExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const sections = useBuilderStore((state) => state.sections);
  const importSections = useBuilderStore((state) => state.importSections);
  const [pageName, setPageName] = useState("My Website");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleExport = () => {
    try {
      downloadPageConfiguration(sections, pageName);
      setImportSuccess(`Successfully exported ${sections.length} sections!`);
      setImportError(null);
      setImportSuccess(null);
    } catch (error) {
      console.error("Export error:", error);
      setImportError(error instanceof Error ? error.message : "Export failed");
      setImportSuccess(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
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

      setImportSuccess(null);
      onClose();
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

  // Custom overlay with blur backdrop
  const BlurOverlay = forwardRef<
    React.ElementRef<typeof DialogOverlay>,
    React.ComponentPropsWithoutRef<typeof DialogOverlay>
  >(({ ...props }, ref) => (
    <DialogOverlay
      ref={ref}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
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
                <Download size={20} className="text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900 text-start">
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
                <Upload size={16} className="mr-2 text-blue-600" />
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
                    <FileText size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {sections.length} sections
                      </p>
                      <p className="text-xs text-gray-500">Ready to export</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleExport}
                    disabled={sections.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Import Section */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Download size={16} className="mr-2 text-green-600" />
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
                  className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 py-12"
                >
                  {isImporting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      Importing...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm font-medium">
                        Click to select JSON file
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
                    <AlertCircle size={16} className="text-red-600 mr-2" />
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
                    <CheckCircle size={16} className="text-green-600 mr-2" />
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
