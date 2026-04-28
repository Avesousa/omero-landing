"use client";

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div>
            <p className="text-2xl font-extrabold text-primary-light">Omero</p>
            <p className="text-medium text-sm mt-1">
              Gestión simple para comercios argentinos
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => scrollToSection("solucion")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Producto
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Precios
            </button>
            <button
              onClick={() => scrollToSection("cta-final")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Contacto
            </button>
          </nav>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 Omero. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
