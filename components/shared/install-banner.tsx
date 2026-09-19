"use client";

import { useState, useEffect, useRef } from "react";
import { X, Download, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const dismissCountRef = useRef(0);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );

    // Don't show if already installed
    if (isStandalone) return;

    // Check if user dismissed too many times recently
    const dismissed = localStorage.getItem("brooklite-install-dismissed");
    const dismissTime = localStorage.getItem("brooklite-install-dismiss-time");
    if (dismissed === "true" && dismissTime) {
      const daysSince = (Date.now() - parseInt(dismissTime)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return; // Don't show for 7 days after dismiss
    }

    // Capture native beforeinstallprompt (may fire later)
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);

    // Show custom banner after delay + engagement
    const timer = setTimeout(() => {
      // Only show if user has scrolled or interacted
      if (window.scrollY > 100 || document.querySelector("[data-user-interacted]")) {
        setShow(true);
      } else {
        // Wait for interaction
        const onInteract = () => {
          setShow(true);
          document.removeEventListener("click", onInteract);
          document.removeEventListener("scroll", onInteract);
        };
        document.addEventListener("click", onInteract, { once: true });
        document.addEventListener("scroll", onInteract, { once: true });
      }
    }, 15000); // 15 seconds

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
    };
  }, [isStandalone]);

  const handleInstall = async () => {
    if (prompt) {
      // Native prompt available
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
        localStorage.setItem("brooklite-install-dismissed", "true");
        localStorage.setItem("brooklite-install-dismiss-time", Date.now().toString());
      }
      setPrompt(null);
    } else if (isIOS) {
      // iOS: show instruction modal
      alert(
        "To install: Tap the Share button (square with arrow up) → 'Add to Home Screen'"
      );
      setShow(false);
    } else {
      // Fallback: try to trigger native UI
      (window as any).appInstallPrompt?.();
      setShow(false);
    }
  };

  const handleDismiss = (permanent = false) => {
    setShow(false);
    if (permanent) {
      localStorage.setItem("brooklite-install-dismissed", "true");
      localStorage.setItem("brooklite-install-dismiss-time", Date.now().toString());
    }
    dismissCountRef.current += 1;
    // Show again sooner if dismissed multiple times
    const delay = dismissCountRef.current > 2 ? 60000 : 30000;
    setTimeout(() => setShow(true), delay);
  };

  if (!show || isStandalone) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:max-w-md md:right-4 z-[60] animate-slide-up",
        isIOS && "md:bottom-20"
      )}
      role="dialog"
      aria-label="Install Brooklite app"
    >
      <div className="bg-white rounded-xl shadow-xl border border-royal-200 p-4 flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-royal-950/10 rounded-lg text-royal-700">
          {isIOS ? (
            <Smartphone className="w-6 h-6" />
          ) : (
            <Download className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-royal-950">Install Brooklite App</p>
          <p className="text-sm text-royal-600 mt-0.5">
            {isIOS
              ? "Tap Share → Add to Home Screen for quick access"
              : "Add to home screen for instant access, offline support & notifications"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleInstall}
            className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
          >
            {isIOS ? "Show How" : "Install"}
          </button>
          <button
            onClick={() => handleDismiss(false)}
            className="btn-outline text-sm px-4 py-2 whitespace-nowrap"
          >
            Later
          </button>
        </div>
        <button
          onClick={() => handleDismiss(true)}
          className="absolute top-2 right-2 text-royal-400 hover:text-royal-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* iOS Instruction Modal */}
      {isIOS && show && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShow(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto mb-4 bg-royal-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-royal-700" />
            </div>
            <h3 className="text-xl font-bold text-royal-950 mb-2">Add to Home Screen</h3>
            <p className="text-royal-600 mb-4">
              Tap the <strong>Share button</strong> (square with arrow up) at the bottom of Safari, then scroll down and tap <strong>"Add to Home Screen"</strong>.
            </p>
            <div className="bg-royal-50 rounded-lg p-4 mb-4 text-left text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-royal-950 text-white rounded flex items-center justify-center text-xs">1</span>
                Tap Share icon (□↑)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-royal-950 text-white rounded flex items-center justify-center text-xs">2</span>
                Scroll to "Add to Home Screen"
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-royal-950 text-white rounded flex items-center justify-center text-xs">3</span>
                Tap "Add"
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              className="btn-primary w-full py-2"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}