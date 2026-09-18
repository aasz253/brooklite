"use server";

import { z } from "zod";
import { requireAdmin, writeAudit } from "@/lib/admin/session";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { AdminActionState } from "@/app/admin/actions/types";

const recordMediaSchema = z.object({
  name: z.string().trim().min(1).max(200),
  url: z.string().trim().min(1).max(1000),
  path: z.string().trim().min(1).max(1000),
  altText: z.string().trim().max(300),
  contentType: z.string().trim().max(100),
  size: z.number().min(0),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
});

/**
 * Records an uploaded image in the media library. The actual upload to
 * Supabase Storage happens from the browser so large files stream directly;
 * this action persists the metadata and lets us audit the action.
 */
export async function recordMedia(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = recordMediaSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid media metadata." };
  }

  const { error } = await admin.service.from("media").insert({
    name: parsed.data.name,
    url: parsed.data.url,
    path: parsed.data.path,
    alt_text: parsed.data.altText,
    content_type: parsed.data.contentType,
    size: parsed.data.size,
    width: parsed.data.width,
    height: parsed.data.height,
    uploaded_by: admin.user.id,
  });

  if (error) {
    console.error("[admin] recordMedia failed", error.message);
    return { ok: false, message: "Failed to record media." };
  }

  await writeAudit(admin.service, admin, {
    action: "uploaded",
    contentType: "media",
    details: `Admin uploaded "${parsed.data.name}".`,
  });
  return { ok: true, message: "Image recorded." };
}

export async function uploadImage(formData: FormData): Promise<AdminActionState> {
  await requireAdmin();

  const file = formData.get("file");
  const path = formData.get("path");

  if (!(file instanceof File) || typeof path !== "string") {
    return { ok: false, message: "Invalid upload data." };
  }

  const service = createSupabaseServiceClient();
  if (!service) {
    return { ok: false, message: "Storage is not configured." };
  }

  const { error: uploadError } = await service.storage.from("school-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (uploadError) {
    console.error("[admin] uploadImage storage failed", uploadError.message);
    return { ok: false, message: `Upload failed: ${uploadError.message}` };
  }

  const { data: publicUrlData } = service.storage.from("school-images").getPublicUrl(path);
  const url = publicUrlData.publicUrl;

  return { ok: true, message: url };
}

/**
 * Deletes a storage object and its media record.
 */
export async function deleteMedia(path: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const service = createSupabaseServiceClient();
  if (!service) {
    return { ok: false, message: "Storage is not configured." };
  }

  const { error: storageError } = await service.storage.from("school-images").remove([path]);
  if (storageError) {
    console.error("[admin] deleteMedia storage failed", storageError.message);
    return { ok: false, message: "Failed to delete image." };
  }

  const { data: mediaRows } = await admin.service
    .from("media")
    .select("id")
    .eq("path", path)
    .limit(1);
  const mediaId = mediaRows?.[0]?.id;
  if (mediaId) {
    await admin.service.from("media").delete().eq("id", mediaId);
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "media",
    details: "Admin deleted an image from storage.",
  });
  return { ok: true, message: "Image deleted." };
}