"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  createSessionToken,
  sessionCookieName,
} from "@/lib/admin/session";
import type { AdminActionState } from "@/app/admin/actions/types";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(200),
  password: z.string().min(8, "Enter your password").max(200),
});

export async function loginAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const service = createSupabaseServiceClient();
  if (!service) {
    return { ok: false, message: "Login is not configured. Please contact the administrator." };
  }

  const { data: secret, error: secretError } = await service
    .from("admin_secrets")
    .select("email, password_hash")
    .eq("email", parsed.data.email)
    .maybeSingle();

  if (secretError || !secret || !bcrypt.compareSync(parsed.data.password, secret.password_hash)) {
    return { ok: false, message: "Invalid email or password. Please try again." };
  }

  const { data: profile } = await service
    .from("admin_profiles")
    .select("id, full_name, email, role, is_active")
    .eq("email", parsed.data.email)
    .eq("is_active", true)
    .maybeSingle();

  if (!profile) {
    return { ok: false, message: "This account does not have admin access." };
  }

  const token = createSessionToken(profile.email);
  if (!token) {
    return { ok: false, message: "Login is misconfigured. Please contact the administrator." };
  }

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  await service.from("audit_log").insert({
    admin_user_id: profile.id,
    admin_email: profile.email,
    action: "login",
    content_type: "admin",
    content_id: "",
    details: "Signed in",
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
  redirect("/admin/login");
}