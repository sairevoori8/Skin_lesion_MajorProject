import { useCallback, useState } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  file: File | null;
  preview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

const ImageUploader = ({ file, preview, onFileSelect, onRemove }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && /\.(jpg|jpeg|png)$/i.test(droppedFile.name)) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFileSelect(selected);
      e.target.value = "";
    },
    [onFileSelect]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            htmlFor="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-primary bg-secondary"
                : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drag & drop your dermoscopic image here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse · JPG, JPEG, PNG
                </p>
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileInput}
            />
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={preview}
                alt="Uploaded lesion"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-3 min-w-0">
                <FileImage className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file && formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={onRemove}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
