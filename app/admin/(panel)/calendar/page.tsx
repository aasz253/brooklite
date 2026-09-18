import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/admin/session";
import { adminCalendarEvents } from "@/lib/data/admin";
import { AdminPageHeader } from "@/components/admin/ui";
import { CalendarManager } from "@/components/admin/calendar-manager";

export const metadata: Metadata = {
  title: "Manage Calendar",
  robots: { index: false, follow: false },
};

export default async function AdminCalendarPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const events = await adminCalendarEvents(admin.service);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="School Calendar"
        description="Manage term dates and events shown on the calendar page."
      />
      <CalendarManager events={events} />
    </div>
  );
}