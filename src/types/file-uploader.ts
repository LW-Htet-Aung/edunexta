export interface UploaderStateProps {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export interface RenderEmptyStateProps {
  isDragActive: boolean;
}

export interface RenderUploadedStateProps {
  previewUrl: string;
}

export interface RenderUploadingStateProps {
  progress: number;
  file: File;
}
