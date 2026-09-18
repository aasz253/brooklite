"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { statisticSchema } from "@/lib/validation/content";
import type { Statistic } from "@/lib/types/school";
import {
  deleteStatistic,
  reorderItems,
  setItemPublished,
  upsertStatistic,
} from "@/app/admin/actions/content";
import { useAdminAction } from "@/components/admin/use-admin-action";
import {
  AdminBadge,
  AdminButton,
  AdminEmptyState,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSwitch,
  AdminCard,
  Modal,
  MoveButtons,
  FormMessage,
} from "@/components/admin/ui";
import { IconPicker } from "@/components/admin/icon-picker";

type FormValues = z.output<typeof statisticSchema>;

export function StatisticsManager({ statistics: initial }: { statistics: Statistic[] }) {
  const [items, setItems] = useState<Statistic[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Statistic | null>(null);

  const saveAction = useAdminAction(upsertStatistic);
  const deleteAction = useAdminAction(deleteStatistic);
  const publishAction = useAdminAction(setItemPublished);
  const reorderAction = useAdminAction(reorderItems);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof statisticSchema>, unknown, FormValues>({
    resolver: zodResolver(statisticSchema),
    defaultValues: { title: "", value: "", description: "", icon: "sparkles", displayOrder: 0, published: true },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", value: "", description: "", icon: "sparkles", displayOrder: items.length, published: true });
    setOpen(true);
  };

  const openEdit = (item: Statistic) => {
    setEditing(item);
    reset({
      id: item.id,
      title: item.title,
      value: item.value,
      description: item.description,
      icon: item.icon,
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
    reorderAction.run({ ids: next.map((item) => item.id), type: "statistic" });
  };

  const onDelete = (item: Statistic) => {
    if (!window.confirm(`Delete the statistic "${item.title}"? This cannot be undone.`)) return;
    deleteAction.run(item.id);
  };

  const published = watch("published");

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
          Add Statistic
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState title="No statistics yet" description="Add your first statistic to power the homepage counters." />
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
                  <p className="truncate text-sm font-semibold text-royal-950">{item.value}</p>
                  <p className="text-xs text-royal-900/50">{item.title}</p>
                </div>
                <AdminBadge published={item.published} />
                <button
                  type="button"
                  onClick={() => publishAction.run({ id: item.id, type: "statistic", published: !item.published })}
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Statistic" : "Add Statistic"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AdminField label="Value" hint="The big headline of the card, e.g. Daycare to Grade 4 or 98%.">
            <AdminInput {...register("value")} placeholder="Daycare to Grade 4" />
            {errors.value ? <p className="mt-1 text-xs font-medium text-red-600">{errors.value.message}</p> : null}
          </AdminField>
          <AdminField label="Title" hint="Short label under the value, e.g. Grade Levels.">
            <AdminInput {...register("title")} placeholder="Grade Levels" />
            {errors.title ? <p className="mt-1 text-xs font-medium text-red-600">{errors.title.message}</p> : null}
          </AdminField>
          <AdminField label="Description">
            <AdminTextarea rows={3} {...register("description")} placeholder="Optional supporting text shown on the card." />
            {errors.description ? <p className="mt-1 text-xs font-medium text-red-600">{errors.description.message}</p> : null}
          </AdminField>
          <AdminField label="Icon">
            <IconPicker {...register("icon")} value={watch("icon")} onChange={(value) => setValue("icon", value)} />
            {errors.icon ? <p className="mt-1 text-xs font-medium text-red-600">{errors.icon.message}</p> : null}
          </AdminField>
          <div className="flex items-center justify-between rounded-xl border border-royal-100 bg-royal-50/40 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-royal-950">Published</p>
              <p className="text-xs text-royal-900/45">Visible on the website</p>
            </div>
            <AdminSwitch checked={published} onChange={(value) => setValue("published", value)} label="Statistic published" />
          </div>
          <div className="flex justify-end gap-3 border-t border-royal-100 pt-4">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton type="submit" pending={saveAction.pending}>
              {editing ? "Save Changes" : "Add Statistic"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}