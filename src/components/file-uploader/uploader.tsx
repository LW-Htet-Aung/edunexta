"use client";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./render-state";
import { toast } from "sonner";
import { UploaderStateProps } from "@/types/file-uploader";
import { v4 as uuidv4 } from "uuid";
import constructS3ImageUrl from "@/lib/construct-s3-image-url";

const initialFileState: UploaderStateProps = {
  id: null,
  file: null,
  uploading: false,
  progress: 0,
  isDeleting: false,
  error: false,
  fileType: "image",
};

interface UploaderProps {
  value?: string;
  onChange?: (val: string) => void;
}

const Uploader = ({ value, onChange }: UploaderProps) => {
  const fileUrl = constructS3ImageUrl(value || "");
  const [fileState, setFileState] = useState<UploaderStateProps>({
    ...initialFileState,
    key: value,
    objectUrl: fileUrl,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));
      try {
        // 1. Get Presigned Url
        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: true,
          }),
        });
        if (!presignedResponse.ok) {
          toast.error("Failed to get presigned Url");
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));
          return;
        }

        const { presignedUrl, key } = await presignedResponse.json();

        // 2. Upload File
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
        });

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFileState((prev) => ({
                ...prev,
                progress,
              }));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key,
              }));
              onChange?.(key);
              toast.success("File uploaded successfully");
              resolve();
            } else {
              reject(new Error("Upload failed"));
            }
          };

          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch {
        toast.error("Something went wrong");
        setFileState((prev) => ({
          ...prev,
          progress: 0,
          error: true,
          uploading: false,
        }));
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        const file = acceptedFiles[0];
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          file: file,
          fileType: "image",
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl, uploadFile]
  );

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));
      const res = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });
      if (!res.ok) {
        toast.error("Failed to remove file from storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));
        return;
      }
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");
      setFileState(initialFileState);

      toast.success("File removed successfully");
    } catch {
      toast.error("Error removing file, please try again");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  };
  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (tooManyFiles) {
        toast.error("Too many files selected, please select only one file.");
      }
      if (fileSizeTooBig) {
        toast.error("File size too big, please select a file less than 5mb.");
      }
    }
  };
  const handleRetry = () => {
    setFileState(initialFileState); // clears error & re-enables dropzone
  };

  const renderContent = () => {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState onRetry={handleRetry} />;
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          previewUrl={fileState.objectUrl}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  };
  // Revoke the object URL when the component unmounts to not memory leak
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5mb
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-100 w-full h-64 cursor-pointer",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <input {...getInputProps()} />
      <CardContent className="flex items-center justify-center size-full">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Uploader;
