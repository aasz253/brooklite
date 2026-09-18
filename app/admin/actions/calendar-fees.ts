"use server";

import { revalidatePath } from "next/cache";
import { calendarEventSchema, feeSchema } from "@/lib/validation/content";
import { requireAdmin, writeAudit } from "@/lib/admin/session";
import type { AdminActionState } from "@/app/admin/actions/types";

function revalidateAll() {
  for (const route of ["/", "/fees", "/calendar", "/admin/fees", "/admin/calendar"]) {
    revalidatePath(route);
  }
}

export async function upsertFee(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = feeSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid fee entry." };
  }

  const payload = {
    academic_year: parsed.data.academicYear,
    term: parsed.data.term,
    class_name: parsed.data.className,
    tuition: parsed.data.tuition,
    administrative_fee: parsed.data.administrativeFee,
    activity_fee: parsed.data.activityFee,
    transport_fee: parsed.data.transportFee,
    other_fees: parsed.data.otherFees,
    notes: parsed.data.notes,
    display_order: parsed.data.displayOrder,
    published: parsed.data.published,
  };

  const { error } = parsed.data.id
    ? await admin.service.from("fees").update(payload).eq("id", parsed.data.id)
    : await admin.service.from("fees").insert(payload);

  if (error) {
    console.error("[admin] upsertFee failed", error.message);
    return { ok: false, message: "Failed to save fee entry." };
  }

  await writeAudit(admin.service, admin, {
    action: parsed.data.id ? "updated" : "created",
    contentType: "fees",
    contentId: parsed.data.id,
    details: `Admin ${parsed.data.id ? "updated" : "added"} fee structure for ${parsed.data.className} (${parsed.data.academicYear} Term ${parsed.data.term}).`,
  });
  revalidateAll();
  return { ok: true, message: "Fee entry saved." };
}

export async function deleteFee(id: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const { error } = await admin.service.from("fees").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteFee failed", error.message);
    return { ok: false, message: "Failed to delete fee entry." };
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "fees",
    contentId: id,
    details: "Admin deleted a fee entry.",
  });
  revalidateAll();
  return { ok: true, message: "Fee entry deleted." };
}

export async function upsertCalendarEvent(values: unknown): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = calendarEventSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid event details." };
  }

  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    event_type: parsed.data.eventType,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate,
    location: parsed.data.location,
    display_order: parsed.data.displayOrder,
    published: parsed.data.published,
  };

  const { error } = parsed.data.id
    ? await admin.service.from("calendar_events").update(payload).eq("id", parsed.data.id)
    : await admin.service.from("calendar_events").insert(payload);

  if (error) {
    console.error("[admin] upsertCalendarEvent failed", error.message);
    return { ok: false, message: "Failed to save event." };
  }

  await writeAudit(admin.service, admin, {
    action: parsed.data.id ? "updated" : "created",
    contentType: "calendar_events",
    contentId: parsed.data.id,
    details: `Admin ${parsed.data.id ? "updated" : "added"} event "${parsed.data.title}".`,
  });
  revalidateAll();
  return { ok: true, message: "Event saved." };
}

export async function deleteCalendarEvent(id: string): Promise<AdminActionState> {
  const admin = await requireAdmin();

  const { error } = await admin.service.from("calendar_events").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteCalendarEvent failed", error.message);
    return { ok: false, message: "Failed to delete event." };
  }

  await writeAudit(admin.service, admin, {
    action: "deleted",
    contentType: "calendar_events",
    contentId: id,
    details: "Admin deleted a calendar event.",
  });
  revalidateAll();
  return { ok: true, message: "Event deleted." };
}