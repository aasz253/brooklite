"use server";

import { revalidatePath } from "next/cache";
import { admissionUpdateSchema } from "@/lib/validation/admissions";
import { socialLinkSchema } from "@/lib/validation/content";
import { requireAdmin, writeAudit } from "@/lib/admin/session";
import type { AdminActionState } from "@/app/admin/actions/types";

export async function updateAdmission(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = admissionUpdateSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid update." };
  }

  const { error } = await admin.service
    .from("admissions")
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[admin] updateAdmission failed", error.message);
    return { ok: false, message: "Failed to update inquiry." };
  }

  await writeAudit(admin.service, admin, {
    action: "updated",
    contentType: "admissions",
    contentId: parsed.data.id,
    details: `Admin set inquiry status to "${parsed.data.status}".`,
  });
  revalidatePath("/admin/admissions");
  return { ok: true, message: "Inquiry updated." };
}

export async function deleteAdmission(id: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const { error } = await admin.service.from("admissions").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteAdmission failed", error.message);
    return { ok: false, message: "Failed to delete inquiry." };
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "admissions",
    contentId: id,
    details: "Admin deleted an admission inquiry.",
  });
  revalidatePath("/admin/admissions");
  return { ok: true, message: "Inquiry deleted." };
}

export async function deleteSocialLink(id: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const { error } = await admin.service.from("social_links").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteSocialLink failed", error.message);
    return { ok: false, message: "Failed to delete social link." };
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "social_links",
    contentId: id,
    details: "Admin deleted a social media link.",
  });
  revalidatePath("/");
  return { ok: true, message: "Social link deleted." };
}

export async function saveSocialLinks(values: unknown[]): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const validValues = values.map((value) => socialLinkSchema.safeParse(value));
  if (validValues.some((value) => !value.success)) {
    return { ok: false, message: "One or more social links are invalid." };
  }

  for (const result of validValues) {
    if (!result.success) continue;
    const data = result.data;
    const payload = {
      platform: data.platform,
      url: data.url,
      label: data.label,
      display_order: data.displayOrder,
      published: data.published,
    };
    const { error } = data.id
      ? await admin.service.from("social_links").update(payload).eq("id", data.id)
      : await admin.service.from("social_links").insert(payload);
    if (error) {
      console.error("[admin] saveSocialLinks failed", error.message);
      return { ok: false, message: "Failed to save social links." };
    }
  }

  await writeAudit(admin.service, admin, {
    action: "updated",
    contentType: "social_links",
    details: "Admin updated social media links.",
  });
  revalidatePath("/");
  return { ok: true, message: "Social links saved." };
}