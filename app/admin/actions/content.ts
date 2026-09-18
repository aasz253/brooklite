"use server";

import { revalidatePath } from "next/cache";
import {
  aboutContentSchema,
  heroContentSchema,
  publishToggleSchema,
  schoolSettingsSchema,
  sortItemsSchema,
  statisticSchema,
} from "@/lib/validation/content";
import { requireAdmin, writeAudit } from "@/lib/admin/session";
import type { AdminActionState } from "@/app/admin/actions/types";

const PUBLIC_ROUTES = ["/", "/facilities", "/fees", "/calendar", "/admissions"];

function revalidatePublic() {
  for (const route of PUBLIC_ROUTES) {
    revalidatePath(route);
  }
  revalidatePath("/admin");
}

type PublishType = "statistic" | "class" | "facility" | "fee" | "event" | "social";

const SORTABLE_TABLES: Record<string, string> = {
  statistic: "statistics",
  class: "classes",
  facility: "facilities",
  fee: "fees",
  event: "calendar_events",
  social: "social_links",
};

export async function saveSchoolSettings(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = schoolSettingsSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid settings." };
  }

  const { error } = await admin.service
    .from("school_settings")
    .update({
      school_name: parsed.data.schoolName,
      tagline: parsed.data.tagline,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email,
      address: parsed.data.address,
      opening_hours: parsed.data.openingHours,
      maps_url: parsed.data.mapsUrl,
      logo_url: parsed.data.logoUrl,
      updated_at: new Date().toISOString(),
      updated_by: admin.user.id,
    })
    .eq("id", 1);

  if (error) {
    console.error("[admin] saveSchoolSettings failed", error.message);
    return { ok: false, message: "Failed to save school information." };
  }

  await writeAudit(admin.service, admin, {
    action: "updated",
    contentType: "school_settings",
    details: `Admin updated school information.`,
  });
  revalidatePublic();
  return { ok: true, message: "School information saved." };
}

export async function saveHero(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = heroContentSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid hero content." };
  }

  const { error } = await admin.service
    .from("hero_content")
    .update({
      badge: parsed.data.badge,
      headline: parsed.data.headline,
      subheading: parsed.data.subheading,
      primary_cta_text: parsed.data.primaryCtaText,
      primary_cta_link: parsed.data.primaryCtaLink,
      secondary_cta_text: parsed.data.secondaryCtaText,
      secondary_cta_link: parsed.data.secondaryCtaLink,
      image_url: parsed.data.imageUrl,
      image_alt: parsed.data.imageAlt,
      published: parsed.data.published,
      updated_at: new Date().toISOString(),
      updated_by: admin.user.id,
    })
    .eq("id", 1);

  if (error) {
    console.error("[admin] saveHero failed", error.message);
    return { ok: false, message: "Failed to save hero content." };
  }

  await writeAudit(admin.service, admin, {
    action: parsed.data.published ? "published" : "updated",
    contentType: "hero_content",
    details: "Admin updated homepage hero.",
  });
  revalidatePublic();
  return { ok: true, message: "Hero content saved." };
}

export async function saveAbout(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = aboutContentSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid about content." };
  }

  const { error } = await admin.service
    .from("about_content")
    .update({
      heading: parsed.data.heading,
      description: parsed.data.description,
      mission: parsed.data.mission,
      vision: parsed.data.vision,
      published: parsed.data.published,
      updated_at: new Date().toISOString(),
      updated_by: admin.user.id,
    })
    .eq("id", 1);

  if (error) {
    console.error("[admin] saveAbout failed", error.message);
    return { ok: false, message: "Failed to save about content." };
  }

  await writeAudit(admin.service, admin, {
    action: "updated",
    contentType: "about_content",
    details: "Admin updated about / mission / vision.",
  });
  revalidatePublic();
  return { ok: true, message: "About content saved." };
}

export async function upsertStatistic(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = statisticSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid statistic." };
  }

  const payload = {
    title: parsed.data.title,
    value: parsed.data.value,
    description: parsed.data.description,
    icon: parsed.data.icon,
    display_order: parsed.data.displayOrder,
    published: parsed.data.published,
  };

  const { error } = parsed.data.id
    ? await admin.service.from("statistics").update(payload).eq("id", parsed.data.id)
    : await admin.service.from("statistics").insert(payload);

  if (error) {
    console.error("[admin] upsertStatistic failed", error.message);
    return { ok: false, message: "Failed to save statistic." };
  }

  await writeAudit(admin.service, admin, {
    action: parsed.data.id ? "updated" : "created",
    contentType: "statistics",
    contentId: parsed.data.id,
    details: `Admin ${parsed.data.id ? "updated" : "added"} statistic "${parsed.data.title}".`,
  });
  revalidatePublic();
  return { ok: true, message: "Statistic saved." };
}

export async function deleteStatistic(id: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const { error } = await admin.service.from("statistics").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteStatistic failed", error.message);
    return { ok: false, message: "Failed to delete statistic." };
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "statistics",
    contentId: id,
    details: "Admin deleted a statistic.",
  });
  revalidatePublic();
  return { ok: true, message: "Statistic deleted." };
}

export async function setItemPublished(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = publishToggleSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: "Invalid publish request." };
  }

  const table = SORTABLE_TABLES[parsed.data.type];
  if (!table) {
    return { ok: false, message: "Unsupported content type." };
  }

  const { error } = await admin.service
    .from(table)
    .update({ published: parsed.data.published })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[admin] setItemPublished failed", error.message);
    return { ok: false, message: "Failed to update publish status." };
  }

  await writeAudit(admin.service, admin, {
    action: parsed.data.published ? "published" : "unpublished",
    contentType: table,
    contentId: parsed.data.id,
    details: `Admin ${parsed.data.published ? "published" : "unpublished"} ${table}.`,
  });
  revalidatePublic();
  return { ok: true, message: "Status updated." };
}

export async function reorderItems(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = sortItemsSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: "Invalid reorder request." };
  }

  const table = SORTABLE_TABLES[parsed.data.type];
  if (!table) {
    return { ok: false, message: "Unsupported content type." };
  }

  for (let index = 0; index < parsed.data.ids.length; index += 1) {
    const { error } = await admin.service
      .from(table)
      .update({ display_order: index + 1 })
      .eq("id", parsed.data.ids[index]);
    if (error) {
      console.error("[admin] reorderItems failed", error.message);
      return { ok: false, message: "Failed to reorder items." };
    }
  }

  await writeAudit(admin.service, admin, {
    action: "reordered",
    contentType: table,
    details: `Admin reordered ${table}.`,
  });
  revalidatePublic();
  return { ok: true, message: "Order saved." };
}