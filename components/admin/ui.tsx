"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type InputHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { X, Loader2, CheckCircle2, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminButton({
  variant = "primary",
  size = "md",
  pending = false,
  className,
  children,
  type,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger" | "ghost" | "success";
  size?: "sm" | "md";
  pending?: boolean;
}) {
  const variants = {
    primary:
      "bg-royal-800 text-white hover:bg-royal-700 shadow-sm shadow-royal-900/10",
    success: "bg-mint-600 text-white hover:bg-mint-500 shadow-sm shadow-mint-900/10",
    danger: "bg-red-600 text-white hover:bg-red-500 shadow-sm shadow-red-900/10",
    outline:
      "border border-royal-200 bg-white text-royal-800 hover:bg-royal-50",
    ghost: "text-royal-800 hover:bg-royal-50",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };

  return (
    <button
      type={type ?? "button"}
      disabled={pending || props.disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function AdminField({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  const autoId = useId();
  return (
    <div>
      <label htmlFor={htmlFor ?? autoId} className="mb-1.5 block text-sm font-semibold text-royal-950">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-royal-900/45">{hint}</p> : null}
    </div>
  );
}

const controlClasses =
  "w-full rounded-lg border border-royal-200 bg-white px-3 py-2 text-sm text-royal-950 placeholder:text-royal-900/35 focus:border-royal-500 focus:outline-none focus:ring-2 focus:ring-royal-200";

export const AdminInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function AdminInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlClasses, className)} {...props} />;
  },
);

export const AdminTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function AdminTextarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(controlClasses, "resize-y", className)} {...props} />;
});

export const AdminSelect = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function AdminSelect({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(controlClasses, "appearance-none pr-8", className)} {...props}>
      {children}
    </select>
  );
});

export function AdminSwitch({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}) {
  const autoId = useId();
  return (
    <button
      type="button"
      id={id ?? autoId}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower-400 focus-visible:ring-offset-1",
        checked ? "bg-mint-600" : "bg-royal-200",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function AdminBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
        published ? "bg-mint-100 text-mint-800" : "bg-royal-100 text-royal-700",
      )}
    >
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-royal-100 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

export function FormMessage({
  state,
  onDismiss,
}: {
  state: { ok: boolean; message: string } | null;
  onDismiss?: () => void;
}) {
  if (!state || !state.message) return null;
  return (
    <div
      role={state.ok ? "status" : "alert"}
      className={cn(
        "flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
        state.ok ? "border-mint-200 bg-mint-50 text-mint-800" : "border-red-200 bg-red-50 text-red-700",
      )}
    >
      <span className="flex items-start gap-2">
        {state.ok ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        {state.message}
      </span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="text-royal-900/40 transition-colors hover:text-royal-900"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export function MoveButtons({
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  label,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={isFirst}
        aria-label={`Move ${label} up`}
        className="rounded p-0.5 text-royal-900/50 transition-colors hover:bg-royal-50 hover:text-royal-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={isLast}
        aria-label={`Move ${label} down`}
        className="rounded p-0.5 text-royal-900/50 transition-colors hover:bg-royal-50 hover:text-royal-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-royal-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl focus:outline-none"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-royal-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-royal-900/50 hover:bg-royal-50 hover:text-royal-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-royal-950">{title}</h1>
        {description ? <p className="mt-1 text-sm text-royal-900/55">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function AdminEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-royal-200 bg-royal-50/40 px-6 py-12 text-center">
      <p className="font-semibold text-royal-800">{title}</p>
      {description ? <p className="mt-1 text-sm text-royal-900/50">{description}</p> : null}
    </div>
  );
}