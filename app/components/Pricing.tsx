"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const plans = [
  {
    name: "Starter",
    price: "Gratis",
    priceNote: "para siempre",
    features: ["Hasta 50 productos", "1 usuario", "Funciones básicas"],
    cta: "Empezá gratis",
    highlighted: false,
  },
  {
    name: "Básico",
    price: "$19",
    priceNote: "/ mes",
    features: ["Hasta 500 productos", "2 usuarios", "Reportes básicos"],
    cta: "Empezá gratis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    priceNote: "/ mes",
    features: [
      "Hasta 5.000 productos",
      "5 usuarios",
      "Reportes avanzados",
      "Código de barras",
    ],
    cta: "Empezá gratis",
    highlighted: true,
    badge: "Más popular",
  },
  {
    name: "Cadena",
    price: "$99",
    priceNote: "/ mes",
    features: [
      "Productos ilimitados",
      "Usuarios ilimitados",
      "Multi-sucursal",
      "API",
    ],
    cta: "Empezá gratis",
    highlighted: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const tracked = useRef(false);

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

  function handleCTA(planName: string) {
    trackEvent("cta_click", { location: "pricing", label: "Empezá gratis", plan: planName });
    scrollToSection("cta-final");
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="bg-light py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            Elegí el plan que se adapta a tu negocio
          </h2>
          <p className="text-lg text-medium">
            Comenzá gratis. Crecé cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-6 flex flex-col shadow-sm transition-shadow hover:shadow-md ${
                plan.highlighted
                  ? "border-2 border-accent shadow-md"
                  : "border border-gray-100"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-dark text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-dark">
                    {plan.price}
                  </span>
                  <span className="text-medium text-sm">{plan.priceNote}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-success font-bold flex-shrink-0">✓</span>
                    <span className="text-dark text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCTA(plan.name)}
                className={`w-full py-3 rounded-xl font-semibold text-base min-h-[48px] transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-white hover:bg-primary-light"
                    : "bg-light text-primary border border-primary hover:bg-primary hover:text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-dark font-medium text-lg">
            💡 ¿Cuánto perdés por mes sin control?{" "}
            <span className="text-primary font-bold">
              $19/mes es menos que una sola venta perdida.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
