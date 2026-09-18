"use client";

import { useState } from "react";
import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AdminSidebarContent } from "@/components/admin/sidebar";

export function AdminShell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string;
  adminEmail: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-offwhite">
      <AdminSidebarContent
        adminName={adminName}
        adminEmail={adminEmail}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-royal-100/70 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-royal-100 text-royal-900 hover:bg-royal-50 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold text-royal-900/70">
              Brooklite Premier School — Content Management
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-royal-200 bg-white px-4 py-2 text-xs font-semibold text-royal-800 transition-colors hover:bg-royal-50"
          >
            View Website
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}