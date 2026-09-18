"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppFloat({ phone }: { phone: string }) {
  const normalized = phone.replace(/[^\d]/g, "");
  const number = normalized.startsWith("0") ? `254${normalized.slice(1)}` : normalized;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    "Hello Brooklite Premier School, I would like to enquire about admission.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Brooklite Premier School on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-mint-600 text-white shadow-lg shadow-mint-900/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower-400 focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}