"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  LineChart,
  Star,
  TriangleAlert,
} from "lucide-react";
import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function formatARS(n: number) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAILY_SALES = [32000, 26000, 41000, 30000, 52000, 61000, 22000];

const STATS = [
  { key: "sales", label: "Ventas", color: "var(--chart-sales)", target: 284900 },
  { key: "expenses", label: "Gastos", color: "var(--chart-expenses)", target: 42000 },
  { key: "profit", label: "Ganancia", color: "var(--chart-profit)", target: 108000 },
  { key: "result", label: "Resultado", color: "var(--chart-result)", target: 66000 },
];

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);
  return value;
}

function StatTile({ label, color, target, active }: { label: string; color: string; target: number; active: boolean }) {
  const value = useCountUp(target, active);
  return (
    <div className="bg-surface-high border border-border rounded-lg px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1.5 text-on-surface-variant">
        <span className="inline-block w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
        {label}
      </p>
      <p className="font-mono font-extrabold text-base sm:text-lg leading-tight mt-1 text-on-surface">
        {formatARS(value)}
      </p>
    </div>
  );
}

function DailyMiniChart({ mode, revealed }: { mode: "bar" | "line"; revealed: boolean }) {
  const width = 460;
  const height = 100;
  const max = Math.max(...DAILY_SALES) * 1.15;
  const bandW = width / DAILY_SALES.length;
  const xAt = (i: number) => i * bandW + bandW / 2;
  const yAt = (v: number) => height - (v / max) * height;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-[100px] transition-opacity duration-500"
      style={{ opacity: revealed ? 1 : 0 }}
      preserveAspectRatio="none"
    >
      {mode === "bar" ? (
        DAILY_SALES.map((v, i) => {
          const barW = bandW * 0.56;
          return (
            <rect
              key={i}
              x={xAt(i) - barW / 2}
              y={yAt(v)}
              width={barW}
              height={height - yAt(v)}
              rx={3}
              fill="var(--chart-sales)"
            />
          );
        })
      ) : (
        <>
          <polyline
            fill="none"
            stroke="var(--chart-sales)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={DAILY_SALES.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")}
          />
          {DAILY_SALES.map((v, i) => (
            <circle key={i} cx={xAt(i)} cy={yAt(v)} r={3.5} fill="var(--chart-sales)" stroke="var(--color-surface)" strokeWidth={1.5} />
          ))}
        </>
      )}
    </svg>
  );
}

type Toast = { id: number; amount: number };

/** Mockup del dashboard real de ventas de Omero. A diferencia del POS del
 * cajero (que la app fuerza siempre oscuro), el dashboard del dueño sí
 * respeta el tema claro/oscuro — así que este widget hace lo mismo. */
function SalesDashboard() {
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<"bar" | "line">("bar");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setRevealed(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed) return;
    let id = 0;
    const interval = setInterval(() => {
      id += 1;
      const amount = Math.round((800 + Math.random() * 2600) / 50) * 50;
      const toastId = id;
      setToasts((prev) => [...prev, { id: toastId, amount }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 2600);
    }, 9000);
    return () => clearInterval(interval);
  }, [revealed]);

  function setChartMode(next: "bar" | "line") {
    setMode(next);
    trackEvent("hero_dashboard_chart_toggle", { mode: next });
  }

  return (
    <div ref={wrapRef} className="w-full max-w-lg mx-auto lg:mx-0">
      <div className="relative rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-low">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
            <span className="text-on-surface-variant/70 text-xs ml-2 font-mono">omero — dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant/50 text-[11px] hidden sm:inline">datos de ejemplo</span>
            <span className="flex items-center gap-1.5 text-teal text-xs">
              <span className="live-dot" /> en vivo
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Ventas / Gastos / Ganancia / Resultado */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {STATS.map((s) => (
              <StatTile key={s.key} label={s.label} color={s.color} target={s.target} active={revealed} />
            ))}
          </div>

          {/* Selector barras / líneas */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant/70">
              Ventas — últimos 7 días
            </span>
            <div className="inline-flex rounded-lg border border-border overflow-hidden">
              {(["bar", "line"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMode(m)}
                  aria-pressed={mode === m}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    mode === m
                      ? "bg-primary-light/15 text-on-surface"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {m === "bar" ? <BarChart3 className="w-3.5 h-3.5" /> : <LineChart className="w-3.5 h-3.5" />}
                  {m === "bar" ? "Barras" : "Líneas"}
                </button>
              ))}
            </div>
          </div>

          <DailyMiniChart mode={mode} revealed={revealed} />
          <div className="flex mt-1.5">
            {DAY_LABELS.map((d) => (
              <span key={d} className="flex-1 text-center text-[10px] text-on-surface-variant/60 font-mono">
                {d}
              </span>
            ))}
          </div>

          {/* Alerta de stock */}
          <div className="flex items-center gap-2.5 mt-4 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2.5">
            <TriangleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-400">
              Stock bajo: <span className="text-on-surface font-medium">Harina 1kg</span> — quedan 3 u.
            </p>
          </div>
        </div>

        {/* Toasts de "venta nueva" */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center gap-2 pointer-events-none w-full px-4 z-10">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="bg-surface border border-border rounded-full px-4 py-2 shadow-xl flex items-center gap-2 text-sm"
              style={{ animation: "fadeInUp 0.3s ease-out forwards" }}
            >
              <span className="live-dot" />
              <span className="text-teal font-mono font-semibold">+{formatARS(t.amount)}</span>
              <span className="text-on-surface-variant">venta nueva</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroRef.current?.style.setProperty("--spot-x", `${x}%`);
    heroRef.current?.style.setProperty("--spot-y", `${y}%`);
  }

  function handlePrimaryCTA() {
    trackEvent("cta_click", { location: "hero", label: "Empezar gratis" });
    scrollToSection("cta-final");
  }

  function handleProductCTA() {
    trackEvent("cta_click", { location: "hero", label: "Ver el producto" });
    scrollToSection("solucion");
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleSpotlight}
      className="relative hero-bg min-h-screen flex items-center pt-24 pb-20 overflow-hidden"
    >
      <div className="spotlight absolute inset-0 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          {/* Left column — copy */}
          <div className="flex-1 text-center lg:text-left" style={{ animation: "fadeInUp 0.7s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2.5 bg-surface-high border border-border text-sm font-medium px-4 py-2.5 rounded-full mb-7">
              <div className="live-dot flex-shrink-0" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-accent fill-accent" />
                ))}
              </div>
              <span className="text-on-surface-variant">+50 comercios ya venden con Omero</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-on-surface leading-[1.08] mb-6 tracking-tight">
              Esto es un comercio real,
              <br />
              vendiendo ahora con <span className="gradient-text">Omero.</span>
            </h1>

            <p className="text-xl text-on-surface-variant mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Este panel se actualiza como el tuyo lo haría.{" "}
              <span className="text-on-surface font-semibold">
                Ventas, gastos, ganancia y resultado, siempre a la vista.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4">
              <button
                onClick={handlePrimaryCTA}
                className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-lg px-8 py-4 min-h-[56px] w-full sm:w-auto hover:scale-105 active:scale-95 transition-transform"
              >
                Empezar gratis
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleProductCTA}
                className="inline-flex items-center justify-center whitespace-nowrap border-2 border-border text-on-surface hover:bg-surface-high font-semibold px-8 py-4 rounded-xl text-lg transition-all min-h-[56px] w-full sm:w-auto hover:scale-105 active:scale-95"
              >
                Ver el producto
              </button>
            </div>
            <p className="text-on-surface-variant/60 text-sm mb-8">
              14 días gratis · sin tarjeta de crédito
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
              {["Sin tarjeta", "Cancelás cuando quieras", "Soporte en español"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-on-surface-variant/70 text-sm">
                  <Check className="w-4 h-4 text-teal" strokeWidth={3} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — dashboard real */}
          <div className="flex-1 w-full" style={{ animation: "fadeInUp 0.9s ease-out forwards" }}>
            <SalesDashboard />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-on-surface-variant/60 text-xs cursor-pointer hover:text-on-surface transition-colors"
        onClick={() => scrollToSection("problema")}
        style={{ animation: "bounceSoft 2.5s ease-in-out infinite" }}
      >
        <span>Descubrí cómo</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
