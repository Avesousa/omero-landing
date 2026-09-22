"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Boxes,
  Check,
  Percent,
  Receipt,
  Star,
  TrendingUp,
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

const DAILY_SALES = [62, 48, 71, 55, 88, 100, 40]; // Lun..Dom, % de altura relativa
const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const TODAY_INDEX = 5;

type Toast = { id: number; amount: number };

/** Mockup del dashboard real de Omero — queda siempre oscuro (Nocturne),
 * independiente del tema de la página, igual que la pantalla del POS
 * real en la app. Es un "screen dentro de screen". */
function SalesDashboard() {
  const [revealed, setRevealed] = useState(false);
  const [total, setTotal] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const target = 284900;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !revealed) {
          setRevealed(true);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const start = performance.now();
    const duration = 1400;
    let raf: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setTotal(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;
    let id = 0;
    const interval = setInterval(() => {
      id += 1;
      const amount = Math.round((800 + Math.random() * 2600) / 50) * 50;
      const toastId = id;
      setTotal((t) => t + amount);
      setToasts((prev) => [...prev, { id: toastId, amount }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 2600);
    }, 9000);
    return () => clearInterval(interval);
  }, [revealed]);

  return (
    <div ref={wrapRef} className="w-full max-w-lg mx-auto lg:mx-0">
      <div className="relative rounded-2xl border border-[#233554] bg-[#0d1c32] shadow-2xl overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#233554] bg-[#0a1730]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
            <span className="text-[#8494b4] text-xs ml-2 font-mono">omero — dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#8494b4]/70 text-[11px] hidden sm:inline">datos de ejemplo</span>
            <span className="flex items-center gap-1.5 text-[#38DEBB] text-xs">
              <span className="live-dot" /> en vivo
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Total del día */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-widest text-[#8494b4]">
              Ventas de hoy
            </span>
            <span className="inline-flex items-center gap-1 text-[#38DEBB] text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              +18% vs. ayer
            </span>
          </div>
          <p className="led-display text-4xl sm:text-5xl font-extrabold mb-4">
            {formatARS(total)}
          </p>

          {/* Gráfico de barras — últimos 7 días */}
          <div className="flex items-end gap-2 h-24 mb-1">
            {DAILY_SALES.map((h, i) => (
              <div key={DAY_LABELS[i]} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t bg-[#1c2a41] flex items-end" style={{ height: 72 }}>
                  <div
                    className="w-full rounded-t transition-[height] duration-700 ease-out"
                    style={{
                      height: revealed ? `${h}%` : "0%",
                      background: i === TODAY_INDEX ? "#FF6B00" : "#3B82F6",
                      transitionDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#8494b4] font-mono">{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>

          {/* Stats secundarias */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: Percent, label: "Margen prom.", value: "38%" },
              { icon: Receipt, label: "Ventas hoy", value: "64" },
              { icon: Boxes, label: "Productos", value: "1.284" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#112036] border border-[#233554] rounded-lg px-3 py-2.5">
                <stat.icon className="w-3.5 h-3.5 text-[#8494b4] mb-1.5" />
                <p className="text-white font-mono font-extrabold text-base leading-none">{stat.value}</p>
                <p className="text-[#8494b4] text-[10px] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Alerta de stock */}
          <div className="flex items-center gap-2.5 mt-3 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2.5">
            <TriangleAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-300">
              Stock bajo: <span className="text-white font-medium">Harina 1kg</span> — quedan 3 u.
            </p>
          </div>
        </div>

        {/* Toasts de "venta nueva" */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center gap-2 pointer-events-none w-full px-4 z-10">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="bg-[#112036] border border-[#233554] rounded-full px-4 py-2 shadow-xl flex items-center gap-2 text-sm"
              style={{ animation: "fadeInUp 0.3s ease-out forwards" }}
            >
              <span className="live-dot" />
              <span className="text-[#38DEBB] font-mono font-semibold">+{formatARS(t.amount)}</span>
              <span className="text-[#8494b4]">venta nueva</span>
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
                Ventas, margen y stock, siempre a la vista.
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
