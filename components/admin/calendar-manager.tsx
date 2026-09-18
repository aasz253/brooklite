"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { calendarEventSchema, EVENT_TYPES } from "@/lib/validation/content";
import type { CalendarEvent } from "@/lib/types/school";
import { deleteCalendarEvent, upsertCalendarEvent } from "@/app/admin/actions/calendar-fees";
import { setItemPublished, reorderItems } from "@/app/admin/actions/content";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { formatDate, formatDateShort } from "@/lib/utils";
import {
  AdminBadge,
  AdminButton,
  AdminEmptyState,
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminSwitch,
  AdminCard,
  Modal,
  MoveButtons,
  FormMessage,
} from "@/components/admin/ui";

const today = () => new Date().toISOString().slice(0, 10);

type FormValues = z.output<typeof calendarEventSchema>;

export function CalendarManager({ events: initial }: { events: CalendarEvent[] }) {
  const [items, setItems] = useState<CalendarEvent[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const saveAction = useAdminAction(upsertCalendarEvent);
  const deleteAction = useAdminAction(deleteCalendarEvent);
  const publishAction = useAdminAction(setItemPublished);
  const reorderAction = useAdminAction(reorderItems);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof calendarEventSchema>, unknown, FormValues>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "School event",
      startDate: today(),
      endDate: today(),
      location: "",
      displayOrder: 0,
      published: true,
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      title: "",
      description: "",
      eventType: "School event",
      startDate: today(),
      endDate: today(),
      location: "",
      displayOrder: items.length,
      published: true,
    });
    setOpen(true);
  };

  const openEdit = (item: CalendarEvent) => {
    setEditing(item);
    reset({
      id: item.id,
      title: item.title,
      description: item.description,
      eventType: item.eventType,
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      displayOrder: item.displayOrder,
      published: item.published,
    });
    setOpen(true);
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setItems(next);
    reorderAction.run({ ids: next.map((item) => item.id), type: "event" });
  };

  const onDelete = (item: CalendarEvent) => {
    if (!window.confirm(`Delete the event "${item.title}"? This cannot be undone.`)) return;
    deleteAction.run(item.id);
  };

  const published = watch("published");
  const startDate = watch("startDate");

  const onSubmit = (values: FormValues) => {
    saveAction.run(values);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <FormMessage state={saveAction.state} />
      <div className="flex justify-end">
        <AdminButton variant="success" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Event
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState title="No events yet" description="Add term dates and school events to show on the calendar page." />
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={item.id}>
              <AdminCard className="flex items-center gap-3 p-4">
                <MoveButtons
                  label={item.title}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  onMoveUp={() => move(index, -1)}
                  onMoveDown={() => move(index, 1)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-royal-950">{item.title}</p>
                  <p className="truncate text-xs text-royal-900/50">
                    {item.eventType} · {formatDate(item.startDate)}
                    {item.startDate !== item.endDate ? ` – ${formatDateShort(item.endDate)}` : ""}
                  </p>
                </div>
                <AdminBadge published={item.published} />
                <button
                  type="button"
                  onClick={() => publishAction.run({ id: item.id, type: "event", published: !item.published })}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-royal-800 hover:bg-royal-50"
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit ${item.title}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-royal-50 hover:text-royal-900"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  aria-label={`Delete ${item.title}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </AdminCard>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Event" : "Add Event"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AdminField label="Event title">
            <AdminInput {...register("title")} placeholder="End of Term 1" />
            {errors.title ? <p className="mt-1 text-xs font-medium text-red-600">{errors.title.message}</p> : null}
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminField label="Type">
              <AdminSelect {...register("eventType")}>
                {EVENT_TYPES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </AdminSelect>
              {errors.eventType ? <p className="mt-1 text-xs font-medium text-red-600">{errors.eventType.message}</p> : null}
            </AdminField>
            <AdminField label="Start date">
              <AdminInput type="date" {...register("startDate")} />
              {errors.startDate ? <p className="mt-1 text-xs font-medium text-red-600">{errors.startDate.message}</p> : null}
            </AdminField>
            <AdminField label="End date">
              <AdminInput type="date" {...register("endDate")} />
              {errors.endDate ? <p className="mt-1 text-xs font-medium text-red-600">{errors.endDate.message}</p> : null}
            </AdminField>
          </div>
          <AdminField label="Location" hint={startDate ? "" : undefined}>
            <AdminInput {...register("location")} placeholder="Brooklite Premier School" />
            {errors.location ? <p className="mt-1 text-xs font-medium text-red-600">{errors.location.message}</p> : null}
          </AdminField>
          <AdminField label="Description">
            <AdminTextarea rows={3} {...register("description")} />
            {errors.description ? <p className="mt-1 text-xs font-medium text-red-600">{errors.description.message}</p> : null}
          </AdminField>
          <div className="flex items-center justify-between rounded-xl border border-royal-100 bg-royal-50/40 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-royal-950">Published</p>
              <p className="text-xs text-royal-900/45">Visible on the calendar page</p>
            </div>
            <AdminSwitch checked={published} onChange={(value) => setValue("published", value)} label="Event published" />
          </div>
          <div className="flex justify-end gap-3 border-t border-royal-100 pt-4">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton type="submit" pending={saveAction.pending}>
              {editing ? "Save Changes" : "Add Event"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}