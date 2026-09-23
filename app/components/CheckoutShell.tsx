import Link from "next/link";

/** Layout liviano para las pantallas de alta (sin las secciones de marketing). */
export function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-on-surface">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" aria-label="Omero — inicio" className="flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 48 48" aria-hidden>
              <rect width="48" height="48" rx="10" fill="#1E40AF" />
              <circle cx="24" cy="25" r="11" fill="none" stroke="white" strokeWidth="6" />
              <polygon points="24,7 29,14 19,14" fill="white" />
            </svg>
            <span className="text-xl font-extrabold tracking-tight text-on-surface">omero</span>
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pago seguro con Mercado Pago
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
