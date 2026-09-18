"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Link2, X, Trash2 } from "lucide-react";
import { uploadImage, recordMedia, deleteMedia } from "@/app/admin/actions/media";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export interface UploadedImage {
  url: string;
  width: number | null;
  height: number | null;
  name: string;
  size: number;
  path: string;
  contentType: string;
}

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  altValue?: string;
  onAltChange?: (value: string) => void;
  compact?: boolean;
}

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

export function ImageUploader({
  value,
  onChange,
  altValue,
  onAltChange,
  compact = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are supported.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    const dimensions = await readDimensions(file);
    if (dimensions.width > 0 && dimensions.height > 0 && (dimensions.width < 200 || dimensions.height < 200)) {
      setError("Please upload an image at least 200px wide and 200px tall.");
      return;
    }

    setUploading(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeExtension = extension === "jpeg" ? "jpg" : extension;
      const path = `uploads/${new Date().getFullYear()}/${crypto.randomUUID()}.${safeExtension}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);

      const uploadResult = await uploadImage(formData);
      if (!uploadResult.ok) {
        throw new Error(uploadResult.message);
      }
      const url = uploadResult.message;

      onChange(url);
      if (!altValue && onAltChange) {
        onAltChange(file.name.replace(/\.[^.]+$/, ""));
      }

      await recordMedia({
        name: file.name,
        url,
        path,
        altText: altValue ?? "",
        contentType: file.type,
        size: file.size,
        width: dimensions.width || null,
        height: dimensions.height || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveStorage = async () => {
    setError(null);
    const match = value.match(/\/school-images\/(.+)$/);
    const path = match ? decodeURIComponent(match[1]) : null;
    if (path) {
      const result = await deleteMedia(path);
      if (!result.ok) {
        setError(result.message);
        return;
      }
    }
    onChange("");
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-royal-200 bg-royal-50/40 p-4 text-center transition-colors hover:border-royal-300">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-royal-500" aria-hidden="true" />
          ) : (
            <ImagePlus className="h-5 w-5 text-royal-500" aria-hidden="true" />
          )}
          <span className="text-xs font-semibold text-royal-800">
            {uploading ? "Uploading…" : "Choose image"}
          </span>
          <span className="text-[0.7rem] text-royal-900/45">JPG, PNG or WEBP · max 5 MB</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
        </label>
        {value ? (
          <p className="flex items-center gap-1.5 truncate text-xs text-royal-900/55">
            <Link2 className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{value}</span>
            <button type="button" onClick={handleRemoveStorage} aria-label="Remove image" className="rounded p-0.5 hover:bg-red-50 hover:text-red-600">
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </p>
        ) : null}
        {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
      <div className="space-y-2">
        <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-royal-200 bg-royal-50/40 p-4 text-center transition-colors hover:border-royal-300">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-royal-500" aria-hidden="true" />
          ) : (
            <ImagePlus className="h-5 w-5 text-royal-500" aria-hidden="true" />
          )}
          <span className="text-xs font-semibold text-royal-800">
            {uploading ? "Uploading…" : "Upload image"}
          </span>
          <span className="text-[0.7rem] text-royal-900/45">JPG · PNG · WEBP</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={handleRemoveStorage}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Remove image
          </button>
        ) : null}
        {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      </div>

      <div className="space-y-2">
        <div
          className={cn(
            "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-royal-100 bg-royal-50/40",
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <p className="text-xs text-royal-900/40">No image selected</p>
          )}
        </div>
        <label className="block text-xs font-semibold text-royal-950">
          Alt text
          <input
            type="text"
            value={altValue}
            onChange={(event) => onAltChange?.(event.target.value)}
            placeholder="Describe the image for accessibility & SEO"
            className={cn("mt-1.5 w-full rounded-lg border border-royal-200 bg-white px-3 py-2 text-sm text-royal-950 placeholder:text-royal-900/35 focus:border-royal-500 focus:outline-none focus:ring-2 focus:ring-royal-200")}
          />
        </label>
      </div>
    </div>
  );
}