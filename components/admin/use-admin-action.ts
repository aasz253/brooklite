"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminActionState } from "@/app/admin/actions/types";

export function useAdminAction<T extends unknown[]>(
  action: (...args: T) => Promise<AdminActionState>,
) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<AdminActionState | null>(null);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = (...args: T) => {
    startTransition(async () => {
      const result = await action(...args);
      setState(result);
      router.refresh();
      if (result.ok && timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setState(null), 4000);
    });
  };

  return { state, run, pending };
}