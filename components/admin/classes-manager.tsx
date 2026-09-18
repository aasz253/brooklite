"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { classLevelSchema } from "@/lib/validation/content";
import type { ClassLevel } from "@/lib/types/school";
import {
  deleteClass,
  upsertClass,
} from "@/app/admin/actions/library";
import { setItemPublished, reorderItems } from "@/app/admin/actions/content";
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
import { ImageUploader } from "@/components/admin/image-uploader";

type FormValues = z.output<typeof classLevelSchema>;

export function ClassesManager({ classes: initial }: { classes: ClassLevel[] }) {
  const [items, setItems] = useState<ClassLevel[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClassLevel | null>(null);

  const saveAction = useAdminAction(upsertClass);
  const deleteAction = useAdminAction(deleteClass);
  const publishAction = useAdminAction(setItemPublished);
  const reorderAction = useAdminAction(reorderItems);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof classLevelSchema>, unknown, FormValues>({
    resolver: zodResolver(classLevelSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      learningFocus: "",
      ageRange: "",
      imageUrl: "",
      imageAlt: "",
      icon: "book-open",
      displayOrder: 0,
      published: true,
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      name: "",
      shortDescription: "",
      learningFocus: "",
      ageRange: "",
      imageUrl: "",
      imageAlt: "",
      icon: "book-open",
      displayOrder: items.length,
      published: true,
    });
    setOpen(true);
  };

  const openEdit = (item: ClassLevel) => {
    setEditing(item);
    reset({
      id: item.id,
      name: item.name,
      shortDescription: item.shortDescription,
      learningFocus: item.learningFocus,
      ageRange: item.ageRange,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
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
    reorderAction.run({ ids: next.map((item) => item.id), type: "class" });
  };

  const onDelete = (item: ClassLevel) => {
    if (!window.confirm(`Delete the class "${item.name}"? This cannot be undone.`)) return;
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
          Add Class
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState title="No classes yet" description="Add the year groups you offer to show on the homepage." />
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={item.id}>
              <AdminCard className="flex items-center gap-3 p-4">
                <MoveButtons
                  label={item.name}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  onMoveUp={() => move(index, -1)}
                  onMoveDown={() => move(index, 1)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-royal-950">{item.name}</p>
                  <p className="truncate text-xs text-royal-900/50">{item.ageRange}</p>
                </div>
                <AdminBadge published={item.published} />
                <button
                  type="button"
                  onClick={() => publishAction.run({ id: item.id, type: "class", published: !item.published })}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-royal-800 hover:bg-royal-50"
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit ${item.name}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-royal-50 hover:text-royal-900"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  aria-label={`Delete ${item.name}`}
                  className="rounded-lg p-2 text-royal-900/60 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </AdminCard>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Class" : "Add Class"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Class name">
              <AdminInput {...register("name")} placeholder="Grade 1" />
              {errors.name ? <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p> : null}
            </AdminField>
            <AdminField label="Age range">
              <AdminInput {...register("ageRange")} placeholder="6 – 7 years" />
              {errors.ageRange ? <p className="mt-1 text-xs font-medium text-red-600">{errors.ageRange.message}</p> : null}
            </AdminField>
          </div>
          <AdminField label="Short description">
            <AdminTextarea rows={2} {...register("shortDescription")} placeholder="Shown on the class card." />
            {errors.shortDescription ? <p className="mt-1 text-xs font-medium text-red-600">{errors.shortDescription.message}</p> : null}
          </AdminField>
          <AdminField label="Learning focus">
            <AdminTextarea rows={3} {...register("learningFocus")} placeholder="What learners explore in this grade." />
            {errors.learningFocus ? <p className="mt-1 text-xs font-medium text-red-600">{errors.learningFocus.message}</p> : null}
          </AdminField>
          <AdminField label="Icon">
            <IconPicker {...register("icon")} value={watch("icon")} onChange={(value) => setValue("icon", value)} />
            {errors.icon ? <p className="mt-1 text-xs font-medium text-red-600">{errors.icon.message}</p> : null}
          </AdminField>
          <AdminField label="Photo">
            <ImageUploader
              value={watch("imageUrl")}
              onChange={(value) => setValue("imageUrl", value)}
              altValue={watch("imageAlt")}
              onAltChange={(value) => setValue("imageAlt", value)}
            />
          </AdminField>
          <div className="flex items-center justify-between rounded-xl border border-royal-100 bg-royal-50/40 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-royal-950">Published</p>
              <p className="text-xs text-royal-900/45">Visible on the website</p>
            </div>
            <AdminSwitch checked={published} onChange={(value) => setValue("published", value)} label="Class published" />
          </div>
          <div className="flex justify-end gap-3 border-t border-royal-100 pt-4">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>Cancel</AdminButton>
            <AdminButton type="submit" pending={saveAction.pending}>
              {editing ? "Save Changes" : "Add Class"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}