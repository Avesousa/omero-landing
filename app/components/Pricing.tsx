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
    features: ["Hasta 50 productos", "1 usuario", "Funciones básicas", "Soporte por email"],
    cta: "Empezá gratis",
    highlighted: false,
    color: "from-gray-400 to-gray-500",
  },
  {
    name: "Básico",
    price: "$12.900",
    priceNote: "/ mes",
    features: ["Hasta 500 productos", "2 usuarios", "Reportes básicos", "Soporte prioritario"],
    cta: "Empezá gratis",
    highlighted: false,
    color: "from-blue-400 to-blue-500",
  },
  {
    name: "Pro",
    price: "$29.900",
    priceNote: "/ mes",
    features: [
      "Hasta 5.000 productos",
      "5 usuarios",
      "Reportes avanzados",
      "Código de barras",
      "Exportación CSV",
    ],
    cta: "Empezá gratis",
    highlighted: true,
    badge: "Más popular",
    color: "from-primary to-primary-light",
  },
  {
    name: "Cadena",
    price: "$59.900",
    priceNote: "/ mes",
    features: [
      "Productos ilimitados",
      "Usuarios ilimitados",
      "Multi-sucursal",
      "API",
      "Onboarding dedicado",
    ],
    cta: "Empezá gratis",
    highlighted: false,
    color: "from-violet-500 to-purple-600",
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
      className="relative bg-gray-50 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #1E40AF, transparent)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
            Precios claros
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            Elegí el plan que se adapta a tu negocio
          </h2>
          <p className="text-lg text-medium">
            Comenzá gratis.{" "}
            <strong className="text-dark">Crecé cuando quieras.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "pricing-pro rounded-2xl p-7 hover:-translate-y-2"
                  : "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    {plan.badge} ⭐
                  </span>
                </div>
              )}

              {/* Color stripe */}
              <div className={`h-1 bg-gradient-to-r ${plan.color} rounded-full mb-5 ${plan.highlighted ? "h-1.5" : ""}`} />

              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-dark mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-extrabold ${plan.highlighted ? "text-primary" : "text-dark"}`}>
                    {plan.price}
                  </span>
                  <span className="text-medium text-sm">{plan.priceNote}</span>
                </div>
                {plan.highlighted && (
                  <p className="text-success text-xs font-semibold mt-1">
                    ✓ 14 días gratis incluidos
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${plan.highlighted ? "bg-primary text-white" : "bg-green-100 text-success"}`}>
                      ✓
                    </span>
                    <span className="text-dark text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCTA(plan.name)}
                className={`w-full py-3.5 rounded-xl font-bold text-base min-h-[48px] transition-all hover:scale-105 active:scale-95 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md hover:shadow-lg glow-primary"
                    : "bg-light text-primary border-2 border-primary hover:bg-primary hover:text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Price anchor */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-7 border border-blue-100">
          <p className="text-dark font-medium text-lg">
            💡 ¿Cuánto perdés por mes sin control?{" "}
            <span className="text-primary font-bold">
              $12.900/mes es menos que una sola venta perdida.
            </span>
          </p>
          <p className="text-medium text-sm mt-2">
            Garantía 30 días — si no quedás conforme, te devolvemos el dinero sin preguntas.
          </p>
        </div>
      </div>
    </section>
  );
}
