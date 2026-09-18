"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  GraduationCap,
  Building2,
  Banknote,
  CalendarDays,
  Inbox,
  Settings,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: PenSquare },
  { href: "/admin/classes", label: "Classes", icon: GraduationCap },
  { href: "/admin/facilities", label: "Facilities", icon: Building2 },
  { href: "/admin/fees", label: "Fees", icon: Banknote },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/admissions", label: "Admissions", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  adminName: string;
  adminEmail: string;
  open: boolean;
  onClose: () => void;
}

export function AdminSidebarContent({ adminName, adminEmail, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sunflower-500 text-royal-950">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold text-white">Brooklite</span>
            <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-sunflower-400">
              Admin Panel
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="rounded-lg p-1 text-white/60 transition-colors hover:text-white md:hidden"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sunflower-500 text-royal-950"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-sm font-semibold text-white">{adminName || "Administrator"}</p>
        <p className="truncate text-xs text-white/50">{adminEmail}</p>
        <form
          action={async () => {
            await logoutAction();
          }}
          className="mt-3"
        >
          <button
            type="submit"
            className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-royal-950 lg:block">
        {body}
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-royal-950/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-royal-950 shadow-2xl">
            {body}
          </aside>
        </div>
      ) : null}
    </>
  );
}