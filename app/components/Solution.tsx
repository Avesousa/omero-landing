"use client";

import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const bullets = [
  "Cargá productos con código de barras",
  "Ver tu margen automáticamente",
  "Imprimí etiquetas en segundos",
];

export default function Solution() {
  function handleCTA() {
    trackEvent("cta_click", { location: "solution", label: "Ver cómo funciona" });
    scrollToSection("cta-final");
  }

  return (
    <section id="solucion" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-2xl">
              <div className="text-center text-white px-8">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold">Demo Omero</p>
                <p className="text-blue-200 mt-2">Ver cómo funciona</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent opacity-20 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
              Omero es la solución.
            </h2>
            <p className="text-lg text-medium mb-8 leading-relaxed">
              Dejá de adivinar y empezá a tomar decisiones con datos reales.
              Omero centraliza todo lo que necesitás para gestionar tu comercio
              de forma profesional, sin importar si tenés 10 o 10.000 productos.
            </p>

            <ul className="space-y-4 mb-8">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-dark font-medium">{bullet}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCTA}
              className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all"
            >
              Ver cómo funciona
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
