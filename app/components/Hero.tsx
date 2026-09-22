"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Banknote,
  Check,
  Coins,
  HeartPulse,
  LineChart,
  Scale,
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
const SALES = [34000, 28000, 45000, 32000, 56000, 64000, 26000];
const EXPENSES = [9500, 7800, 12500, 8900, 15700, 17900, 7300];
const PROFIT = [12900, 10600, 17100, 12200, 21300, 24300, 9900];
const RESULT = PROFIT.map((p, i) => p - EXPENSES[i]);

type ViewId = "sales" | "expenses" | "profit" | "result";

const VIEWS: Record<
  ViewId,
  { label: string; icon: typeof Coins; color: string; data: number[]; change: number; inverse?: boolean }
> = {
  sales: { label: "Ventas", icon: Coins, color: "var(--chart-sales)", data: SALES, change: 18 },
  expenses: { label: "Gastos", icon: Banknote, color: "var(--chart-expenses)", data: EXPENSES, change: 6, inverse: true },
  profit: { label: "Ganancia", icon: HeartPulse, color: "var(--chart-profit)", data: PROFIT, change: 21 },
  result: { label: "Resultado", icon: Scale, color: "var(--chart-result)", data: RESULT, change: 14 },
};

const VIEW_ORDER: ViewId[] = ["sales", "expenses", "profit", "result"];

function useCountUp(target: number, active: boolean, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
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

function DailyMiniChart({ data, color, mode, revealed }: { data: number[]; color: string; mode: "bar" | "line"; revealed: boolean }) {
  const width = 460;
  const height = 100;
  const max = Math.max(...data, 1) * 1.15;
  const min = Math.min(0, ...data);
  const bandW = width / data.length;
  const xAt = (i: number) => i * bandW + bandW / 2;
  const yAt = (v: number) => height - ((v - min) / (max - min)) * height;
  const zeroY = yAt(0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-[100px] transition-opacity duration-300"
      style={{ opacity: revealed ? 1 : 0 }}
      preserveAspectRatio="none"
    >
      {mode === "bar" ? (
        data.map((v, i) => {
          const barW = bandW * 0.56;
          const top = Math.min(yAt(v), zeroY);
          return (
            <rect
              key={i}
              x={xAt(i) - barW / 2}
              y={top}
              width={barW}
              height={Math.max(1, Math.abs(yAt(v) - zeroY))}
              rx={3}
              fill={color}
            />
          );
        })
      ) : (
        <>
          <polyline
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={data.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")}
          />
          {data.map((v, i) => (
            <circle key={i} cx={xAt(i)} cy={yAt(v)} r={3.5} fill={color} stroke="var(--color-surface)" strokeWidth={1.5} />
          ))}
        </>
      )}
    </svg>
  );
}

type Toast = { id: number; amount: number };

/** Mockup del dashboard real de ventas de Omero: pestañas Ventas / Gastos /
 * Ganancia / Resultado, igual que el selector de vistas del DailyChart real
 * — cada una cambia el número grande y el gráfico de 7 días. A diferencia
 * del POS del cajero (que la app fuerza siempre oscuro), el dashboard del
 * dueño sí respeta el tema claro/oscuro — así que este widget hace lo mismo. */
function SalesDashboard() {
  const [revealed, setRevealed] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>("sales");
  const [mode, setMode] = useState<"bar" | "line">("bar");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const view = VIEWS[activeView];
  const total = view.data.reduce((a, b) => a + b, 0);
  const value = useCountUp(total, revealed);
  const up = view.change >= 0;
  const good = view.inverse ? !up : up;
  const changeColor = good ? "var(--chart-profit)" : "var(--chart-expenses)";

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

  function selectView(id: ViewId) {
    setActiveView(id);
    trackEvent("hero_dashboard_view", { view: id });
  }

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
          {/* Pestañas: Ventas / Gastos / Ganancia / Resultado */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto">
            {VIEW_ORDER.map((id) => {
              const v = VIEWS[id];
              const active = activeView === id;
              return (
                <button
                  key={id}
                  onClick={() => selectView(id)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors flex-shrink-0 ${
                    active
                      ? "bg-primary-light/15 border-primary-light text-on-surface"
                      : "bg-surface-high border-border text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <v.icon className="w-3.5 h-3.5" style={{ color: active ? v.color : undefined }} />
                  {v.label}
                </button>
              );
            })}
          </div>

          {/* Número grande de la vista activa */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant/70">
              {view.label} — últimos 7 días
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: changeColor }}>
              {up ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              {Math.abs(view.change)}% vs. semana pasada
            </span>
          </div>
          <p
            className="font-mono font-extrabold text-4xl sm:text-5xl mb-4 transition-colors duration-300"
            style={{ color: view.color, textShadow: `0 0 16px color-mix(in srgb, ${view.color} 45%, transparent)` }}
          >
            {formatARS(value)}
          </p>

          {/* Selector barras / líneas */}
          <div className="flex items-center justify-end mb-2">
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

          <DailyMiniChart data={view.data} color={view.color} mode={mode} revealed={revealed} />
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
