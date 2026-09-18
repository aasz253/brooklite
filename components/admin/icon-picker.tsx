"use client";

import { forwardRef } from "react";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";
import { AdminSelect } from "@/components/admin/ui";

interface IconPickerProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}

export const IconPicker = forwardRef<HTMLSelectElement, IconPickerProps>(function IconPicker(
  { value, onChange, id, ...props },
  ref,
) {
  return (
    <div className="flex items-start gap-3">
      <AdminSelect
        ref={ref}
        id={id}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        {...props}
      >
        {ICON_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </AdminSelect>
      {value ? (
        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal-50 text-royal-800">
          {(() => {
            const Icon = getIcon(value);
            return <Icon className="h-5 w-5" aria-hidden="true" />;
          })()}
        </span>
      ) : null}
    </div>
  );
});