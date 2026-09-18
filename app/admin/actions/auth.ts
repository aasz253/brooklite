"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      message: "Invalid email or password. Please try again.",
    };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}