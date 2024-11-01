import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
}

export function FileUpload({ onChange, value }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);
        setPreview(file.name);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors
          ${
            isDragActive
              ? "border-primary/50 bg-primary/5"
              : "border-muted/50 hover:border-primary/50 hover:bg-muted/50"
          }`}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-background/50 p-4">
              <File className="size-12 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-foreground">
                {value.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-background/50 p-4">
              <Upload className="size-12 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragActive ? "Drop your file here" : "Upload your resume"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF only (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
