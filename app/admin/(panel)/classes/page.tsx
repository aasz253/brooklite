import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/admin/session";
import { adminClasses } from "@/lib/data/admin";
import { AdminPageHeader } from "@/components/admin/ui";
import { ClassesManager } from "@/components/admin/classes-manager";

export const metadata: Metadata = {
  title: "Manage Classes",
  robots: { index: false, follow: false },
};

export default async function AdminClassesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const classes = await adminClasses(admin.service);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Classes"
        description="Manage the year groups listed on the homepage."
      />
      <ClassesManager classes={classes} />
    </div>
  );
}