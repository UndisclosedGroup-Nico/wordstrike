"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-line bg-panel p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-2xl tracking-wide">
            {title}
          </h2>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2 text-fog hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint"
              aria-label="Close"
            >
              ×
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
