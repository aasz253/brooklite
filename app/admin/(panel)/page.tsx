import Link from "next/link";
import {
  Inbox,
  Building2,
  GraduationCap,
  Banknote,
  CalendarDays,
  ArrowRight,
  Users,
} from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin/session";
import { SectionIntro } from "@/components/shared/section";
import { formatDateTime } from "@/lib/utils";
import type { DbAdmission } from "@/lib/types/database";

const STATUS_STYLES: Record<string, string> = {
  New: "bg-mint-100 text-mint-800",
  Contacted: "bg-sunflower-100 text-sunflower-800",
  Processing: "bg-royal-100 text-royal-800",
  Enrolled: "bg-mint-200 text-mint-900",
  Closed: "bg-royal-200 text-royal-700",
};

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  const service = admin.service;

  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: totalAdmissions },
    { count: newAdmissions },
    { count: publishedFacilities },
    { count: publishedClasses },
    { count: publishedFees },
    { data: upcomingEvents },
    { data: recentAdmissions },
  ] = await Promise.all([
    service.from("admissions").select("id", { count: "exact", head: true }),
    service.from("admissions").select("id", { count: "exact", head: true }).eq("status", "New"),
    service.from("facilities").select("id", { count: "exact", head: true }).eq("published", true),
    service.from("classes").select("id", { count: "exact", head: true }).eq("published", true),
    service.from("fees").select("id", { count: "exact", head: true }).eq("published", true),
    service
      .from("calendar_events")
      .select("id,title,event_type,start_date")
      .eq("published", true)
      .gte("start_date", today)
      .order("start_date", { ascending: true })
      .limit(5),
    service
      .from("admissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const stats = [
    {
      label: "Total Admissions",
      value: totalAdmissions ?? 0,
      icon: Inbox,
      href: "/admin/admissions",
    },
    {
      label: "New Inquiries",
      value: newAdmissions ?? 0,
      icon: Users,
      href: "/admin/admissions",
    },
    {
      label: "Published Facilities",
      value: publishedFacilities ?? 0,
      icon: Building2,
      href: "/admin/facilities",
    },
    {
      label: "Published Classes",
      value: publishedClasses ?? 0,
      icon: GraduationCap,
      href: "/admin/classes",
    },
    {
      label: "Fee Entries",
      value: publishedFees ?? 0,
      icon: Banknote,
      href: "/admin/fees",
    },
  ];

  return (
    <div className="space-y-10">
      <SectionIntro
        align="left"
        eyebrow={`Welcome, ${admin.profile.fullName || "Administrator"}`}
        title="Dashboard Overview"
        description="A snapshot of your school's website content and admissions."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-3xl border border-royal-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-royal-800 text-sunflower-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowRight className="h-4 w-4 text-royal-900/30 transition-transform group-hover:translate-x-1 group-hover:text-royal-900/60" aria-hidden="true" />
              </div>
              <p className="font-display mt-4 text-3xl font-extrabold text-royal-950">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-royal-900/55">{stat.label}</p>
            </Link>
          );
        })}
        <Link
          href="/admin/calendar"
          className="group rounded-3xl border border-royal-100 bg-royal-950 p-6 shadow-sm transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sunflower-500 text-royal-950">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </span>
            <ArrowRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60" aria-hidden="true" />
          </div>
          <p className="font-display mt-4 text-3xl font-extrabold text-white">
            {(upcomingEvents ?? []).length}
          </p>
          <p className="mt-1 text-sm font-medium text-white/55">Upcoming Calendar Events</p>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-royal-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-royal-950">Recent Admissions</h2>
            <Link
              href="/admin/admissions"
              className="text-sm font-semibold text-royal-800 hover:underline"
            >
              View all
            </Link>
          </div>

          {(recentAdmissions ?? []).length === 0 ? (
            <p className="rounded-xl bg-royal-50/60 px-4 py-8 text-center text-sm text-royal-900/50">
              No admission inquiries yet. They will appear here as families apply.
            </p>
          ) : (
            <ul className="divide-y divide-royal-100">
              {(recentAdmissions as DbAdmission[]).map((admission) => (
                <li key={admission.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-royal-950">
                      {admission.parent_name}
                    </p>
                    <p className="text-xs text-royal-900/50">
                      Class: {admission.target_class} · {formatDateTime(admission.created_at)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${STATUS_STYLES[admission.status] ?? STATUS_STYLES.New}`}
                  >
                    {admission.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-royal-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-royal-950">Upcoming Events</h2>
            <Link
              href="/admin/calendar"
              className="text-sm font-semibold text-royal-800 hover:underline"
            >
              Manage
            </Link>
          </div>

          {(upcomingEvents ?? []).length === 0 ? (
            <p className="rounded-xl bg-royal-50/60 px-4 py-8 text-center text-sm text-royal-900/50">
              No upcoming published events.
            </p>
          ) : (
            <ul className="space-y-3">
              {(upcomingEvents ?? []).map((event) => (
                <li key={event.id} className="rounded-xl bg-royal-50/60 p-4">
                  <p className="text-sm font-semibold text-royal-950">{event.title}</p>
                  <p className="mt-0.5 text-xs text-royal-900/50">
                    {event.event_type} · {formatDateTime(event.start_date)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}