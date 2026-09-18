"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction } from "@/app/admin/actions/auth";
import { initialState } from "@/app/admin/actions/types";
import { AdminField, AdminInput, AdminButton, FormMessage } from "@/components/admin/ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState());

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage state={state} />
      <AdminField label="Email address">
        <AdminInput
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="admin@brooklitepremier.co.ke"
        />
      </AdminField>
      <AdminField label="Password">
        <AdminInput
          type="password"
          name="password"
          autoComplete="current-password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </AdminField>
      <AdminButton type="submit" pending={pending} className="w-full">
        {pending ? "Signing in…" : "Sign In"}
      </AdminButton>
      <p className="text-center text-xs text-royal-900/45">
        Authorized administrators only. Your session is protected by Supabase Auth.
      </p>
    </form>
  );
}