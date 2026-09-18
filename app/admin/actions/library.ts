"use server";

import { revalidatePath } from "next/cache";
import { classLevelSchema, facilitySchema } from "@/lib/validation/content";
import { requireAdmin, writeAudit } from "@/lib/admin/session";
import type { AdminActionState } from "@/app/admin/actions/types";

function revalidateAll() {
  for (const route of ["/", "/facilities", "/admissions", "/admin/classes", "/admin/facilities"]) {
    revalidatePath(route);
  }
}

export async function upsertClass(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = classLevelSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid class details." };
  }

  const payload = {
    name: parsed.data.name,
    short_description: parsed.data.shortDescription,
    learning_focus: parsed.data.learningFocus,
    age_range: parsed.data.ageRange,
    image_url: parsed.data.imageUrl,
    image_alt: parsed.data.imageAlt,
    icon: parsed.data.icon,
    display_order: parsed.data.displayOrder,
    published: parsed.data.published,
  };

  const { error } = parsed.data.id
    ? await admin.service.from("classes").update(payload).eq("id", parsed.data.id)
    : await admin.service.from("classes").insert(payload);

  if (error) {
    console.error("[admin] upsertClass failed", error.message);
    return { ok: false, message: "Failed to save class." };
  }

  await writeAudit(admin.service, admin, {
    action: parsed.data.id ? "updated" : "created",
    contentType: "classes",
    contentId: parsed.data.id,
    details: `Admin ${parsed.data.id ? "updated" : "added"} class "${parsed.data.name}".`,
  });
  revalidateAll();
  return { ok: true, message: "Class saved." };
}

export async function deleteClass(id: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const { error } = await admin.service.from("classes").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteClass failed", error.message);
    return { ok: false, message: "Failed to delete class." };
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "classes",
    contentId: id,
    details: "Admin deleted a class.",
  });
  revalidateAll();
  return { ok: true, message: "Class deleted." };
}

export async function upsertFacility(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = facilitySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid facility details." };
  }

  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    image_url: parsed.data.imageUrl,
    image_alt: parsed.data.imageAlt,
    icon: parsed.data.icon,
    featured: parsed.data.featured,
    display_order: parsed.data.displayOrder,
    published: parsed.data.published,
  };

  const { error } = parsed.data.id
    ? await admin.service.from("facilities").update(payload).eq("id", parsed.data.id)
    : await admin.service.from("facilities").insert(payload);

  if (error) {
    console.error("[admin] upsertFacility failed", error.message);
    return { ok: false, message: "Failed to save facility." };
  }

  await writeAudit(admin.service, admin, {
    action: parsed.data.id ? "updated" : "created",
    contentType: "facilities",
    contentId: parsed.data.id,
    details: `Admin ${parsed.data.id ? "updated" : "added"} facility "${parsed.data.title}".`,
  });
  revalidateAll();
  return { ok: true, message: "Facility saved." };
}

export async function deleteFacility(id: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const { error } = await admin.service.from("facilities").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteFacility failed", error.message);
    return { ok: false, message: "Failed to delete facility." };
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "facilities",
    contentId: id,
    details: "Admin deleted a facility.",
  });
  revalidateAll();
  return { ok: true, message: "Facility deleted." };
}