"use client";

import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const steps = [
  {
    step: "01",
    icon: "📷",
    text: "Cargá un producto con código de barras",
    time: "5 seg",
  },
  {
    step: "02",
    icon: "💰",
    text: "Ves tu margen de ganancia calculado automáticamente",
    time: "Inmediato",
  },
  {
    step: "03",
    icon: "🏷️",
    text: "Imprimís una etiqueta de precio actualizada",
    time: "10 seg",
  },
];

export default function Solution() {
  function handleCTA() {
    trackEvent("cta_click", { location: "solution", label: "Ver cómo funciona" });
    scrollToSection("cta-final");
  }

  return (
    <section id="solucion" className="relative bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full opacity-5 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, #1E40AF, transparent)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* Left — demo placeholder */}
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              {/* Demo screen with mock UI */}
              <div className="bg-gradient-to-br from-primary to-blue-600 aspect-video flex flex-col items-center justify-center px-8 relative overflow-hidden">
                {/* Grid bg */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Play button */}
                <button
                  onClick={handleCTA}
                  className="relative z-10 flex flex-col items-center gap-4 group"
                >
                  <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center border-2 border-white border-opacity-50 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-white">Ver demo de Omero</p>
                    <p className="text-blue-200 mt-1 text-sm">30 segundos que cambian todo</p>
                  </div>
                </button>

                {/* Floating mini stats */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  {[
                    { val: "1.284", lbl: "Productos" },
                    { val: "38%", lbl: "Margen" },
                    { val: "$48K", lbl: "Ventas hoy" },
                  ].map((s) => (
                    <div key={s.lbl} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white border-opacity-20">
                      <p className="text-white font-extrabold text-base">{s.val}</p>
                      <p className="text-blue-200 text-xs">{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — copy */}
          <div className="flex-1">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
              Cómo funciona
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
              Omero es la solución.
            </h2>
            <p className="text-lg text-medium mb-10 leading-relaxed">
              Dejá de adivinar y empezá a tomar decisiones con datos reales.
              Omero centraliza todo lo que necesitás para gestionar tu comercio
              de forma profesional, sin importar si tenés 10 o 10.000 productos.
            </p>

            {/* Step-by-step */}
            <div className="space-y-5 mb-10">
              {steps.map((step) => (
                <div key={step.step} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-extrabold text-sm shadow-md group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-dark font-semibold leading-snug">{step.text}</p>
                    <p className="text-success text-sm font-bold mt-0.5">⚡ {step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCTA}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded-xl text-base hover:bg-primary-light transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Empezá gratis ahora
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
