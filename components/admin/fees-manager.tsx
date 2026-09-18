"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { feeSchema } from "@/lib/validation/content";
import type { FeeStructure } from "@/lib/types/school";
import { deleteFee, upsertFee } from "@/app/admin/actions/calendar-fees";
import { setItemPublished, reorderItems } from "@/app/admin/actions/content";
import { useAdminAction } from "@/components/admin/use-admin-action";
import { formatKsh } from "@/lib/utils";
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

const CLASS_OPTIONS = [
  "Daycare",
  "Playgroup",
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
];

const THIS_YEAR = new Date().getFullYear();

type FormValues = z.output<typeof feeSchema>;

export function FeesManager({ fees: initial }: { fees: FeeStructure[] }) {
  const [items, setItems] = useState<FeeStructure[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FeeStructure | null>(null);

  const saveAction = useAdminAction(upsertFee);
  const deleteAction = useAdminAction(deleteFee);
  const publishAction = useAdminAction(setItemPublished);
  const reorderAction = useAdminAction(reorderItems);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof feeSchema>, unknown, FormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      academicYear: THIS_YEAR,
      term: 1,
      className: "Daycare",
      tuition: 0,
      administrativeFee: 0,
      activityFee: 0,
      transportFee: 0,
      otherFees: 0,
      notes: "",
      displayOrder: 0,
      published: false,
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      academicYear: THIS_YEAR,
      term: 1,
      className: "Daycare",
      tuition: 0,
      administrativeFee: 0,
      activityFee: 0,
      transportFee: 0,
      otherFees: 0,
      notes: "",
      displayOrder: items.length,
      published: false,
    });
    setOpen(true);
  };

  const openEdit = (item: FeeStructure) => {
    setEditing(item);
    reset({
      id: item.id,
      academicYear: item.academicYear,
      term: item.term,
      className: item.className,
      tuition: item.tuition,
      administrativeFee: item.administrativeFee,
      activityFee: item.activityFee,
      transportFee: item.transportFee,
      otherFees: item.otherFees,
      notes: item.notes,
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
    reorderAction.run({ ids: next.map((item) => item.id), type: "fee" });
  };

  const onDelete = (item: FeeStructure) => {
    if (!window.confirm(`Delete the fee entry for ${item.className} (${item.academicYear} Term ${item.term})?`)) return;
    deleteAction.run(item.id);
  };

  const published = watch("published");
  const tuition = watch("tuition");

  const walletTotal = [watch("tuition"), watch("administrativeFee"), watch("activityFee"), watch("transportFee"), watch("otherFees")]
    .reduce((sum, value) => sum + (Number(value) || 0), 0);

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
          Add Fee Entry
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState title="No fee entries yet" description="Add fees per class and term to show on the fees page." />
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={item.id}>
              <AdminCard className="flex items-center gap-3 p-4">
                <MoveButtons
                  label={item.className}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  onMoveUp={() => move(index, -1)}
                  onMoveDown={() => move(index, 1)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-royal-950">
                    {item.className}
                    <span className="ml-2 text-xs font-medium text-royal-900/50">
                      {item.academicYear} · Term {item.term}
                    </span>
                  </p>
                  <p className="truncate text-xs text-royal-900/50">
                    Tuition {formatKsh(item.tuition)} · Total {formatKsh(item.tuition + item.administrativeFee + item.activityFee + item.transportFee + item.otherFees)}
                  </p>
                </div>
                <AdminBadge published={item.published} />
                <button
                  type="button"
                  onClick={() => publishAction.run({ id: item.id, type: "fee", published: !item.published })}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-royal-800 hover:bg-royal-50"
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit fee entry for ${item.className}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-royal-50 hover:text-royal-900"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  aria-label={`Delete fee entry for ${item.className}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </AdminCard>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Fee Entry" : "Add Fee Entry"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminField label="Academic year">
              <AdminInput type="number" min={2020} max={2100} {...register("academicYear", { valueAsNumber: true })} />
              {errors.academicYear ? <p className="mt-1 text-xs font-medium text-red-600">{errors.academicYear.message}</p> : null}
            </AdminField>
            <AdminField label="Term">
              <AdminSelect {...register("term", { valueAsNumber: true })}>
                <option value={1}>Term 1</option>
                <option value={2}>Term 2</option>
                <option value={3}>Term 3</option>
              </AdminSelect>
              {errors.term ? <p className="mt-1 text-xs font-medium text-red-600">{errors.term.message}</p> : null}
            </AdminField>
            <AdminField label="Class">
              <AdminSelect {...register("className")}>
                {CLASS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </AdminSelect>
              {errors.className ? <p className="mt-1 text-xs font-medium text-red-600">{errors.className.message}</p> : null}
            </AdminField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Tuition (KES)">
              <AdminInput type="number" min={0} step={100} {...register("tuition", { valueAsNumber: true })} />
              {errors.tuition ? <p className="mt-1 text-xs font-medium text-red-600">{errors.tuition.message}</p> : null}
            </AdminField>
            <AdminField label="Administrative fee (KES)">
              <AdminInput type="number" min={0} step={100} {...register("administrativeFee", { valueAsNumber: true })} />
              {errors.administrativeFee ? <p className="mt-1 text-xs font-medium text-red-600">{errors.administrativeFee.message}</p> : null}
            </AdminField>
            <AdminField label="Activity fee (KES)">
              <AdminInput type="number" min={0} step={100} {...register("activityFee", { valueAsNumber: true })} />
              {errors.activityFee ? <p className="mt-1 text-xs font-medium text-red-600">{errors.activityFee.message}</p> : null}
            </AdminField>
            <AdminField label="Transport fee (KES)">
              <AdminInput type="number" min={0} step={100} {...register("transportFee", { valueAsNumber: true })} />
              {errors.transportFee ? <p className="mt-1 text-xs font-medium text-red-600">{errors.transportFee.message}</p> : null}
            </AdminField>
          </div>

          <AdminField label="Other fees (KES)">
            <AdminInput type="number" min={0} step={100} {...register("otherFees", { valueAsNumber: true })} />
            {errors.otherFees ? <p className="mt-1 text-xs font-medium text-red-600">{errors.otherFees.message}</p> : null}
          </AdminField>

          <p className="rounded-lg bg-royal-50 px-3 py-2 text-sm font-semibold text-royal-800">
            Estimated total per term: {formatKsh(walletTotal)}
          </p>

          <AdminField label="Notes">
            <AdminTextarea rows={2} {...register("notes")} placeholder="Optional note, e.g. termly payments broken into monthly instalments." />
            {errors.notes ? <p className="mt-1 text-xs font-medium text-red-600">{errors.notes.message}</p> : null}
          </AdminField>

          <div className="flex items-center justify-between rounded-xl border border-royal-100 bg-royal-50/40 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-royal-950">Published</p>
              <p className="text-xs text-royal-900/45">Visible on the fees page</p>
            </div>
            <AdminSwitch checked={published} onChange={(value) => setValue("published", value)} label="Fee entry published" />
          </div>

          <div className="flex justify-end gap-3 border-t border-royal-100 pt-4">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton type="submit" pending={saveAction.pending}>
              {editing ? "Save Changes" : "Add Fee Entry"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}