import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { DbAdminProfile } from "@/lib/types/database";
import type { AdminProfile } from "@/lib/types/school";

export interface AdminContext {
  user: { id: string; email?: string };
  profile: AdminProfile;
  service: NonNullable<ReturnType<typeof createSupabaseServiceClient>>;
}

function mapProfile(row: DbAdminProfile): AdminProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    isActive: row.is_active,
  };
}

/**
 * Resolves the currently signed-in administrator, or returns null.
 * Intended for read-only checks inside layouts/pages.
 */
export async function getCurrentAdmin(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const service = createSupabaseServiceClient();
  if (!service) return null;

  const { data: profile } = await service
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) return null;

  return {
    user: { id: user.id, email: user.email },
    profile: mapProfile(profile),
    service,
  };
}

/**
 * Same as getCurrentAdmin but redirects unauthenticated/unprivileged
 * callers to the login page. Use inside Server Actions and guards.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function writeAudit(
  service: SupabaseClient,
  admin: AdminContext,
  input: {
    action: string;
    contentType: string;
    contentId?: string;
    details?: string;
  },
) {
  const { error } = await service.from("audit_log").insert({
    admin_user_id: admin.user.id,
    admin_email: admin.profile.email,
    action: input.action,
    content_type: input.contentType,
    content_id: input.contentId ?? "",
    details: input.details ?? "",
  });
  if (error) {
    console.error("[audit] failed to write audit log", error.message);
  }
}