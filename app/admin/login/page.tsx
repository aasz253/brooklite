import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-offwhite px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-800 text-sunflower-400 shadow-lg">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-bold text-royal-950">
            Brooklite Admin
          </h1>
          <p className="mt-1 text-sm text-royal-900/55">
            Manage website content, admissions and school information.
          </p>
        </div>
        <div className="mt-8 rounded-3xl border border-royal-100 bg-white p-7 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}