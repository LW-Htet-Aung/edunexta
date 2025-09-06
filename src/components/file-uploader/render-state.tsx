import { cn } from "@/lib/utils";
import { CloudUpload, ImageIcon, Trash, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  RenderEmptyStateProps,
  RenderUploadedStateProps,
  RenderUploadingStateProps,
} from "@/types/file-uploader";
import Image from "next/image";
import { Progress } from "../ui/progress";

export const RenderEmptyState = ({ isDragActive }: RenderEmptyStateProps) => {
  return (
    <div className="text-center ">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <Upload
          size={16}
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your file here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button" className="mt-4">
        Select a file
      </Button>
    </div>
  );
};

export const RenderErrorState = () => {
  return (
    <div className="text-center ">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon size={16} className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs text-muted-foreground mt-1">Something went wrong</p>
      <Button type="button" className="mt-4">
        Try again
      </Button>
    </div>
  );
};

export const RenderUploadedState = ({
  previewUrl,
}: RenderUploadedStateProps) => {
  return (
    <div className="text-center">
      <Image
        src={previewUrl}
        alt="uploaded-file"
        width={100}
        height={100}
        className="object-contain p-2"
      />
      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4 cursor-pointer", "")}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
};

export const RenderUploadingState = ({
  progress,
  file,
}: RenderUploadingStateProps) => {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <Progress value={progress} />
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
};
