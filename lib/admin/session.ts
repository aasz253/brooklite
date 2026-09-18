import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { DbAdminProfile } from "@/lib/types/database";
import type { AdminProfile } from "@/lib/types/school";

export const sessionCookieName = "bl_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

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

function sessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function toBase64Url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

/**
 * Signs a short-lived session token (payload.sig) for the given admin email.
 * Returns null if the signing secret is missing or too weak.
 */
export function createSessionToken(email: string): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = toBase64Url(JSON.stringify({ email, exp }));
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/**
 * Verifies a session token's signature and expiry. Returns the admin email,
 * or null when the token is invalid/expired/misconfigured.
 */
export function verifySessionToken(token: string): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let parsed: { email?: string; exp?: number };
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (
    typeof parsed.email !== "string" ||
    typeof parsed.exp !== "number" ||
    parsed.exp < Date.now() / 1000
  ) {
    return null;
  }
  return parsed.email;
}

/**
 * Resolves the currently signed-in administrator, or returns null.
 * Intended for read-only checks inside layouts/pages.
 */
export async function getCurrentAdmin(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;

  const email = verifySessionToken(token);
  if (!email) return null;

  const service = createSupabaseServiceClient();
  if (!service) return null;

  const { data: profile } = await service
    .from("admin_profiles")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();

  if (!profile) return null;

  return {
    user: { id: profile.id, email: profile.email },
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
  return { error };
}