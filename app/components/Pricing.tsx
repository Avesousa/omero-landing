"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Lightbulb, Star } from "lucide-react";
import { trackEvent } from "./Analytics";

/** code = PlanCode de omero-billing (el alta toma precios y trial reales de la API). */
const plans: Array<{
  code: "BASICO" | "PRO" | "CADENA";
  name: string;
  monthly: number;
  annual: number;
  free?: boolean;
  features: string[];
  highlighted: boolean;
  badge?: string;
}> = [
  {
    code: "BASICO",
    name: "Básico",
    monthly: 14900,
    annual: 149000,
    features: ["Hasta 500 productos", "2 usuarios", "Reportes básicos", "Etiquetas de góndola"],
    highlighted: false,
  },
  {
    code: "PRO",
    name: "Pro",
    monthly: 32900,
    annual: 329000,
    features: [
      "Hasta 5.000 productos",
      "5 usuarios",
      "Dashboard completo",
      "Código de barras + CSV",
      "Mercado Pago integrado",
    ],
    highlighted: true,
    badge: "Más elegido",
  },
  {
    code: "CADENA",
    name: "Cadena",
    monthly: 69900,
    annual: 699000,
    features: ["Productos ilimitados", "Usuarios ilimitados", "Multi-sucursal", "API + onboarding dedicado"],
    highlighted: false,
  },
];

function formatARS(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const tracked = useRef(false);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !tracked.current) {
          tracked.current = true;
          trackEvent("pricing_view");
        }
      },
      { threshold: 0.3 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  function handleCTA(plan: (typeof plans)[number]) {
    trackEvent("cta_click", { location: "pricing", label: "Probar", plan: plan.name });
    window.location.href = `/registro?plan=${plan.code}&intervalo=${annual ? "ANNUAL" : "MONTHLY"}`;
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative bg-surface-container-lowest py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full ambient-blob-blue" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="eyebrow-chip text-primary-light bg-blue-500/10 border-blue-500/25">
            Precios claros
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-4 mt-5">
            Elegí el plan que se adapta a tu negocio
          </h2>
          <p className="text-lg text-on-surface-variant">
            Empezá gratis. <strong className="text-on-surface">Crecé cuando quieras.</strong> Precios en pesos, sin sorpresas en dólares.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-semibold transition-colors ${!annual ? "text-on-surface" : "text-on-surface-variant/50"}`}>
            Mensual
          </span>
          <button
            onClick={() => setAnnual((a) => !a)}
            className={`relative w-12 h-6.5 rounded-full transition-colors ${annual ? "bg-primary" : "bg-surface-container-high"}`}
            style={{ width: 48, height: 26 }}
            aria-label="Alternar facturación anual"
          >
            <span
              className="absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-md transition-all"
              style={{ left: annual ? 25 : 3 }}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? "text-on-surface" : "text-on-surface-variant/50"}`}>
            Anual <span className="text-teal font-bold">−2 meses</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 items-start">
          {plans.map((plan) => {
            const price = plan.free ? "Gratis" : formatARS(annual ? plan.annual : plan.monthly);
            const period = plan.free ? "para siempre" : annual ? "/ año" : "/ mes";
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 ${
                  plan.highlighted
                    ? "pricing-pro"
                    : "bg-surface-container border border-border hover:border-primary-light/50 hover:-translate-y-1"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="btn-primary inline-flex items-center gap-1.5 text-[11px] px-4 py-1 rounded-full whitespace-nowrap">
                      <Star className="w-3 h-3 fill-white" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-extrabold text-on-surface mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className={`text-3xl font-extrabold font-mono ${plan.highlighted ? "text-accent" : "text-on-surface"}`}>
                    {price}
                  </span>
                  <span className="text-xs text-on-surface-variant/60">{period}</span>
                </div>
                <p className="text-teal text-xs font-bold min-h-[16px] mb-4">
                  {!plan.free && "14 días gratis incluidos"}
                </p>

                <div className="h-px bg-border mb-5" />

                <ul className="space-y-3 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-on-surface">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.highlighted ? "bg-accent text-white" : "bg-teal/15 text-teal"}`}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCTA(plan)}
                  className={`inline-flex items-center justify-center whitespace-nowrap w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 ${
                    plan.highlighted
                      ? "btn-primary"
                      : "border-2 border-primary-light/40 text-on-surface hover:bg-primary-light/10"
                  }`}
                >
                  {plan.free ? "Empezar gratis" : "Probar gratis"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center bento-card rounded-2xl p-7">
          <p className="text-on-surface font-medium text-lg flex items-center justify-center gap-2 flex-wrap">
            <Lightbulb className="w-5 h-5 text-primary-light flex-shrink-0" />
            ¿Cuánto perdés por mes sin control de márgenes?{" "}
            <span className="text-primary-light font-bold">El plan Pro cuesta menos que una sola venta a pérdida.</span>
          </p>
          <p className="text-on-surface-variant text-sm mt-2">
            Garantía de 30 días. Si no te sirve, te devolvemos el dinero sin preguntas.
          </p>
        </div>
      </div>
    </section>
  );
}
