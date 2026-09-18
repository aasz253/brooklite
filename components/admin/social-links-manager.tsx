"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SocialLink } from "@/lib/types/school";
import { saveSocialLinks, deleteSocialLink } from "@/app/admin/actions/admissions-social";
import { useAdminAction } from "@/components/admin/use-admin-action";
import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminSwitch,
  AdminCard,
  FormMessage,
} from "@/components/admin/ui";

interface LinkRow {
  key: string;
  id?: string;
  platform: string;
  url: string;
  label: string;
  published: boolean;
}

let rowCounter = 0;
const nextKey = () => `row-${++rowCounter}-${Date.now()}`;

export function SocialLinksManager({ links: initial }: { links: SocialLink[] }) {
  const [rows, setRows] = useState<LinkRow[]>(
    initial.map((link) => ({
      key: link.id,
      id: link.id,
      platform: link.platform,
      url: link.url,
      label: link.label,
      published: link.published,
    })),
  );

  const saveAction = useAdminAction(saveSocialLinks);
  const deleteAction = useAdminAction(deleteSocialLink);

  const updateRow = (key: string, patch: Partial<LinkRow>) => {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows((current) => [
      ...current,
      { key: nextKey(), id: undefined, platform: "", url: "", label: "", published: true },
    ]);
  };

  const removeRow = (row: LinkRow) => {
    setRows((current) => current.filter((item) => item.key !== row.key));
    if (row.id) deleteAction.run(row.id);
  };

  const onSubmit = () => {
    const payload = rows.map((row, index) => ({
      id: row.id,
      platform: row.platform,
      url: row.url,
      label: row.label,
      displayOrder: index,
      published: row.published,
    }));
    saveAction.run(payload as unknown[]);
  };

  return (
    <div className="space-y-4">
      <FormMessage state={saveAction.state} />
      <FormMessage state={deleteAction.state} />

      {rows.length === 0 ? (
        <p className="rounded-xl bg-royal-50/60 px-4 py-6 text-center text-sm text-royal-900/50">
          No social links yet. Add your school&apos;s Facebook, Instagram, WhatsApp or YouTube pages.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.key}>
              <AdminCard className="grid gap-4 p-4 md:grid-cols-[1fr_1.2fr_0.8fr_auto_auto] md:items-end">
                <AdminField label="Platform">
                  <AdminInput
                    value={row.platform}
                    onChange={(event) => updateRow(row.key, { platform: event.target.value })}
                    placeholder="Facebook"
                  />
                </AdminField>
                <AdminField label="URL">
                  <AdminInput
                    value={row.url}
                    onChange={(event) => updateRow(row.key, { url: event.target.value })}
                    placeholder="https://facebook.com/brooklitepremier"
                  />
                </AdminField>
                <AdminField label="Label (optional)">
                  <AdminInput
                    value={row.label}
                    onChange={(event) => updateRow(row.key, { label: event.target.value })}
                    placeholder="Follow us"
                  />
                </AdminField>
                <div className="flex items-center gap-3 md:flex-col md:items-center md:justify-end md:gap-1 md:pb-1">
                  <span className="text-xs font-semibold text-royal-900/60 md:hidden">Published</span>
                  <AdminSwitch
                    checked={row.published}
                    onChange={(value) => updateRow(row.key, { published: value })}
                    label={`Publish ${row.platform || "social link"}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(row)}
                  aria-label={`Remove ${row.platform || "social link"}`}
                  className="self-center rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-red-50 hover:text-red-600 md:mb-1"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </AdminCard>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-3">
        <AdminButton variant="outline" onClick={addRow}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Row
        </AdminButton>
        <AdminButton type="button" pending={saveAction.pending} onClick={onSubmit}>
          {saveAction.pending ? "Saving…" : "Save Social Links"}
        </AdminButton>
      </div>
    </div>
  );
}