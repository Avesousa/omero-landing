"use client";

import { useEffect, useRef, useState } from "react";
import { Boxes, CreditCard, ScanBarcode, Smartphone, Tag, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Boxes,
    title: "Control de stock real",
    description: "Sabés qué tenés sin contar físicamente. Alerta automática cuando el stock es bajo, en cualquier sucursal.",
    wide: true,
  },
  {
    icon: TrendingUp,
    title: "Márgenes automáticos",
    description: "Nunca más vendés a pérdida sin saberlo. El sistema calcula tu ganancia en tiempo real.",
  },
  {
    icon: Tag,
    title: "Etiquetas de precios",
    description: "Actualizás todos los precios en minutos. Un cambio, todos los carteles actualizados.",
  },
  {
    icon: Smartphone,
    title: "App desktop + web",
    description: "Usás desde la caja o desde el celular. Funciona sin internet en la app desktop.",
  },
  {
    icon: ScanBarcode,
    title: "Código de barras",
    description: "Escaneás y listo. Sin errores de tipeo, sin perder tiempo buscando el producto.",
  },
  {
    icon: CreditCard,
    title: "Cobro con Mercado Pago integrado",
    description: "Pago mixto efectivo + QR en la misma venta, con cálculo de vuelto y cierre de caja diario automático.",
    wide: true,
  },
];

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { ref, value };
}

function StatCard({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div ref={ref} className="text-center py-6 bento-card rounded-2xl">
      <p className="text-4xl font-extrabold gradient-text font-mono">
        {value}
        {suffix}
      </p>
      <p className="text-on-surface-variant text-sm mt-1">{label}</p>
    </div>
  );
}

export default function Benefits() {
  return (
    <section
      id="beneficios"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-surface"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full ambient-blob-blue" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full ambient-blob-orange" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow-chip text-primary-light bg-blue-500/10 border-blue-500/25">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-4 mt-5">
            Todo lo que tu negocio necesita
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Sin funciones innecesarias. Sin curva de aprendizaje. Solo lo que usás todos los días.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className={`bento-card rounded-2xl p-7 hover:-translate-y-1 transition-transform ${
                benefit.wide ? "md:col-span-2" : ""
              }`}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light/[0.14] mb-5">
                <benefit.icon className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">{benefit.title}</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm max-w-md">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard target={50} suffix="+" label="comercios activos" />
          <StatCard target={10} suffix=" min" label="promedio de onboarding" />
          <StatCard target={98} suffix="%" label="satisfacción del usuario" />
        </div>
      </div>
    </section>
  );
}
