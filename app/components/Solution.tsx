"use client";

import { ArrowRight, Percent, ScanLine, Tag, Zap } from "lucide-react";
import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const steps = [
  {
    step: "01",
    icon: ScanLine,
    text: "Cargá un producto con código de barras",
    time: "5 seg",
  },
  {
    step: "02",
    icon: Percent,
    text: "Ves tu margen de ganancia calculado automáticamente",
    time: "Inmediato",
  },
  {
    step: "03",
    icon: Tag,
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
    <section id="solucion" className="relative bg-surface-container-lowest py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full ambient-blob-blue -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Left — cinematic demo player */}
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border scanlines">
              <div className="bg-gradient-to-br from-primary-deep via-primary to-primary-light aspect-video flex flex-col items-center justify-center px-8 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <button onClick={handleCTA} className="relative z-10 flex flex-col items-center gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 group-hover:scale-110 group-hover:border-accent transition-all duration-300 shadow-2xl glow-accent">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-white">Ver demo de Omero</p>
                    <p className="text-blue-200 mt-1 text-sm">30 segundos que cambian todo</p>
                  </div>
                </button>

                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  {[
                    { val: "1.284", lbl: "Productos" },
                    { val: "38%", lbl: "Margen" },
                    { val: "$48K", lbl: "Ventas hoy" },
                  ].map((s) => (
                    <div key={s.lbl} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white/20">
                      <p className="text-white font-extrabold text-base font-mono">{s.val}</p>
                      <p className="text-blue-200 text-xs">{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — copy */}
          <div className="flex-1">
            <span className="eyebrow-chip text-primary-light bg-blue-500/10 border-blue-500/25">
              Cómo funciona
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-4 mt-5">
              Omero es la solución.
            </h2>
            <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
              Dejá de adivinar y empezá a tomar decisiones con datos reales.
              Omero centraliza todo lo que necesitás para gestionar tu comercio
              de forma profesional, sin importar si tenés 10 o 10.000 productos.
            </p>

            <div className="space-y-5 mb-10">
              {steps.map((step) => (
                <div key={step.step} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-high border border-border flex items-center justify-center text-on-surface font-mono font-extrabold text-sm shadow-md group-hover:border-primary-light transition-colors">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-on-surface font-semibold leading-snug flex items-center gap-2">
                      <step.icon className="w-4 h-4 text-primary-light flex-shrink-0" />
                      {step.text}
                    </p>
                    <p className="text-teal text-sm font-bold mt-0.5 font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCTA}
              className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap px-7 py-3.5 rounded-xl text-base hover:scale-105 active:scale-95 transition-transform"
            >
              Empezar ahora
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
