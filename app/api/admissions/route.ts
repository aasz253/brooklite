import { NextRequest } from "next/server";
import { admissionFormSchema } from "@/lib/validation/admissions";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const service = createSupabaseServiceClient();

  if (!service) {
    return Response.json(
      { ok: false, message: "The booking service is not configured yet." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = admissionFormSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = fieldErrors[key] ?? [];
      fieldErrors[key].push(issue.message);
    }
    return Response.json(
      { ok: false, message: "Please review the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // The target class must come from the database, never free text.
  const { data: classRow } = await service
    .from("classes")
    .select("name")
    .eq("name", data.targetClass)
    .eq("published", true)
    .limit(1)
    .maybeSingle();

  if (!classRow) {
    return Response.json(
      {
        ok: false,
        fieldErrors: { targetClass: ["Please choose a valid target class."] },
      },
      { status: 422 },
    );
  }

  // Simple rate limit: at most 3 submissions per phone or email per hour.
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentCount } = await service
    .from("admissions")
    .select("id", { count: "estimated", head: true })
    .or(`phone.eq.${data.phone},email.eq.${data.email}`)
    .gte("created_at", since);

  if ((recentCount ?? 0) >= 3) {
    return Response.json(
      {
        ok: false,
        message: "Too many requests. Please try again later or call us directly.",
      },
      { status: 429 },
    );
  }

  const { error } = await service.from("admissions").insert({
    parent_name: data.parentName,
    phone: data.phone,
    email: data.email,
    child_name: data.childName,
    target_class: data.targetClass,
    preferred_transport: data.preferredTransport,
    message: data.message,
    status: "New",
  });

  if (error) {
    console.error("[api/admissions] insert failed", error.message);
    return Response.json(
      { ok: false, message: "We couldn't save your inquiry. Please try again." },
      { status: 500 },
    );
  }

  return Response.json(
    { ok: true, message: "received" },
    { status: 201 },
  );
}