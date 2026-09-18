export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatKsh(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

const KE_NUMBER = /^(?:\+?254|0)7\d{8}$/;

export function normalizeKenyanPhone(input: string): string {
  const digits = input.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+")) {
    return `+${digits.slice(1)}`;
  }
  if (digits.startsWith("00")) {
    return `+${digits.slice(2)}`;
  }
  if (digits.startsWith("254")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+254${digits.slice(1)}`;
  }
  if (digits.startsWith("7")) {
    return `+254${digits}`;
  }
  return digits;
}

export function isValidKenyanPhone(input: string): boolean {
  return KE_NUMBER.test(input.replace(/[\s\-()]/g, ""));
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizeKenyanPhone(phone);
  const digits = normalized.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}