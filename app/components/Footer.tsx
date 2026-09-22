"use client";

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="relative bg-surface-container-lowest pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 48 48">
              <rect width="48" height="48" rx="10" fill="#1E40AF" />
              <circle cx="24" cy="25" r="11" fill="none" stroke="white" strokeWidth="6" />
              <polygon points="24,7 29,14 19,14" fill="white" />
            </svg>
            <div className="text-left">
              <p className="text-xl font-extrabold text-on-surface">omero</p>
              <p className="text-on-surface-variant/60 text-sm">
                Gestión simple para comercios argentinos
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => scrollToSection("solucion")}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-sm"
            >
              Producto
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-sm"
            >
              Precios
            </button>
            <button
              onClick={() => scrollToSection("cta-final")}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-sm"
            >
              Contacto
            </button>
          </nav>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-on-surface-variant/60 text-sm">© 2026 Omero. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-on-surface-variant/60 hover:text-on-surface-variant text-sm transition-colors">
              Términos
            </a>
            <a href="#" className="text-on-surface-variant/60 hover:text-on-surface-variant text-sm transition-colors">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
