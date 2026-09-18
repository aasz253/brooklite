"use client";

import { useState, useMemo } from "react";
import { Search, Trash2, Phone, Mail, Bus, Eye } from "lucide-react";
import type { DbAdmission } from "@/lib/types/database";
import type { AdmissionStatus } from "@/lib/types/school";
import { ADMISSION_STATUSES } from "@/lib/validation/admissions";
import { updateAdmission, deleteAdmission } from "@/app/admin/actions/admissions-social";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { AdminButton, AdminEmptyState, AdminField, AdminInput, AdminSelect, AdminTextarea, AdminCard, Modal, FormMessage } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils";

const STATUS_STYLES: Record<AdmissionStatus, string> = {
  New: "bg-mint-100 text-mint-800",
  Contacted: "bg-sunflower-100 text-sunflower-800",
  Processing: "bg-royal-100 text-royal-800",
  Enrolled: "bg-mint-200 text-mint-900",
  Closed: "bg-royal-200 text-royal-700",
};

export function AdmissionsManager({ admissions: initial }: { admissions: DbAdmission[] }) {
  const [items, setItems] = useState<DbAdmission[]>(initial);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdmissionStatus | "All">("All");
  const [selected, setSelected] = useState<DbAdmission | null>(null);
  const [draftStatus, setDraftStatus] = useState<AdmissionStatus>("New");
  const [draftNotes, setDraftNotes] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const updateAction = useAdminAction(updateAdmission);
  const deleteAction = useAdminAction(deleteAdmission);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        needle === "" ||
        item.parent_name.toLowerCase().includes(needle) ||
        item.child_name.toLowerCase().includes(needle) ||
        item.phone.toLowerCase().includes(needle) ||
        item.target_class.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  const openDetails = (item: DbAdmission) => {
    setSelected(item);
    setDraftStatus(item.status);
    setDraftNotes(item.notes ?? "");
  };

  const beginSave = (item: DbAdmission) => {
    setSavingId(item.id);
    updateAction.run({ id: item.id, status: draftStatus, notes: draftNotes });
  };

  const onDelete = (item: DbAdmission) => {
    if (!window.confirm(`Delete the inquiry from ${item.parent_name}? This cannot be undone.`)) return;
    deleteAction.run(item.id);
    setSelected(null);
  };

  const counts = useMemo(() => {
    const result: Partial<Record<AdmissionStatus, number>> = {};
    for (const status of ADMISSION_STATUSES) result[status] = 0;
    for (const item of items) result[item.status] = (result[item.status] ?? 0) + 1;
    return result;
  }, [items]);

  return (
    <div className="space-y-4">
      <FormMessage state={updateAction.state} />
      <FormMessage state={deleteAction.state} />

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <AdminField label="Search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-900/35" aria-hidden="true" />
            <AdminInput
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by parent, child, phone or class…"
              className="pl-9"
            />
          </div>
        </AdminField>
        <AdminField label="Filter by status">
          <AdminSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AdmissionStatus | "All")}>
            <option value="All">All statuses</option>
            {ADMISSION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status} ({counts[status] ?? 0})
              </option>
            ))}
          </AdminSelect>
        </AdminField>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState title="No admission inquiries yet" description="Applications submitted through the public admissions form will appear here." />
      ) : filtered.length === 0 ? (
        <AdminEmptyState title="No matching inquiries" description="Try adjusting your search or filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-royal-100 bg-white shadow-sm">
          <ul className="divide-y divide-royal-100">
            {filtered.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
                <button type="button" onClick={() => openDetails(item)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                  <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${STATUS_STYLES[item.status]}`}>
                    {item.child_name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-royal-950">
                      {item.child_name}
                      <span className="ml-2 font-normal text-royal-900/45">prefers {item.target_class}</span>
                    </span>
                    <span className="block truncate text-xs text-royal-900/50">
                      {item.parent_name} · {formatDateTime(item.created_at)}
                    </span>
                  </span>
                </button>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${STATUS_STYLES[item.status]}`}>
                  {item.status}
                </span>
                <button
                  type="button"
                  onClick={() => openDetails(item)}
                  aria-label={`View inquiry from ${item.parent_name}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-royal-50 hover:text-royal-900"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  aria-label={`Delete inquiry from ${item.parent_name}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected ? (
        <Modal open onClose={() => setSelected(null)} title="Admission Inquiry">
          <div className="space-y-5">
            <div className="rounded-xl bg-royal-50/60 p-4">
              <p className="font-display text-lg font-bold text-royal-950">{selected.child_name}</p>
              <p className="text-sm text-royal-900/55">Target class: {selected.target_class}</p>
              <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${STATUS_STYLES[selected.status]}`}>
                {selected.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-royal-950">
                <Phone className="h-4 w-4 text-royal-900/40" aria-hidden="true" />
                {selected.phone}
              </p>
              {selected.email ? (
                <p className="flex items-center gap-2 text-royal-950">
                  <Mail className="h-4 w-4 text-royal-900/40" aria-hidden="true" />
                  {selected.email}
                </p>
              ) : null}
              <p className="flex items-center gap-2 text-royal-950">
                <Bus className="h-4 w-4 text-royal-900/40" aria-hidden="true" />
                {selected.preferred_transport ? "Requires school transport" : "Does not require transport"}
              </p>
              <p className="text-royal-900/50">Parent/guardian: {selected.parent_name}</p>
              <p className="text-royal-900/50">Submitted: {formatDateTime(selected.created_at)}</p>
            </div>

            {selected.message ? (
              <div>
                <p className="mb-1 text-sm font-semibold text-royal-950">Message from the parent</p>
                <p className="rounded-xl bg-royal-50/60 p-4 text-sm text-royal-900/75">{selected.message}</p>
              </div>
            ) : null}

            <div className="space-y-4 border-t border-royal-100 pt-5">
              <AdminField label="Status">
                <AdminSelect value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as AdmissionStatus)}>
                  {ADMISSION_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </AdminSelect>
              </AdminField>
              <AdminField label="Internal notes" hint="Only visible to the admin team.">
                <AdminTextarea rows={3} value={draftNotes} onChange={(event) => setDraftNotes(event.target.value)} placeholder="e.g. Called the parent on 18 Sep; tour booked for Friday." />
              </AdminField>
              <div className="flex items-center justify-between gap-3">
                <AdminButton variant="danger" onClick={() => onDelete(selected)}>Delete Inquiry</AdminButton>
                <AdminButton type="button" pending={savingId === selected.id} onClick={() => beginSave(selected)}>
                  Save Changes
                </AdminButton>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}