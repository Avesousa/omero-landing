"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

type Product = { name: string; price: number };

const CATALOG: Record<string, Product> = {
  "247": { name: "Aceite Girasol 1,5L", price: 1740 },
  "012": { name: "Coca-Cola 500ml", price: 1200 },
  "156": { name: "Yerba Playadito 1kg", price: 2100 },
  "089": { name: "Detergente 500ml", price: 1950 },
};

type CartLine = { code: string; name: string; price: number; qty: number };

function formatARS(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

function PosDemo() {
  const [code, setCode] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [flash, setFlash] = useState<"idle" | "notfound" | "charged">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  function addByCode(rawCode: string) {
    const product = CATALOG[rawCode];
    if (!product) {
      setFlash("notfound");
      setTimeout(() => setFlash("idle"), 1000);
      return;
    }
    trackEvent("demo_scan", { location: "hero", code: rawCode });
    setCart((prev) => {
      const existing = prev.find((l) => l.code === rawCode);
      if (existing) {
        return prev.map((l) => (l.code === rawCode ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { code: rawCode, name: product.name, price: product.price, qty: 1 }];
    });
  }

  function pressDigit(d: string) {
    if (flash === "charged") return;
    const next = (code + d).slice(0, 3);
    setCode(next);
    if (next.length === 3) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        addByCode(next);
        setCode("");
      }, 220);
    }
  }

  function pressClear() {
    setCode("");
    setFlash("idle");
  }

  function pressCharge() {
    if (cart.length === 0 || flash === "charged") return;
    trackEvent("cta_click", { location: "hero_demo", label: "Cobrar" });
    setFlash("charged");
    setTimeout(() => {
      setCart([]);
      setFlash("idle");
    }, 2200);
  }

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Invitation badge */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 z-20 inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap"
        style={{ animation: "bounceSoft 2.4s ease-in-out infinite" }}
      >
        👆 Tocá un producto — es de verdad
      </div>

      <div className="rounded-2xl border border-border bg-surface-container-lowest shadow-2xl overflow-hidden">
        {/* Terminal chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
            <span className="text-on-surface-variant/60 text-xs ml-2 font-mono">omero — terminal 01</span>
          </div>
          <span className="flex items-center gap-1.5 text-teal text-xs">
            <span className="live-dot" /> en vivo
          </span>
        </div>

        {/* Screen */}
        <div className="px-5 pt-5 pb-4 bg-black/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant/50">
              Código de producto
            </span>
            {flash === "notfound" && (
              <span className="text-[11px] font-semibold text-red-400">no encontrado</span>
            )}
          </div>
          <div className="led-display text-4xl font-extrabold h-11 flex items-center">
            {code.padEnd(3, "·").split("").map((ch, i) => (
              <span key={i} className="inline-block w-[1ch] text-center">
                {ch}
              </span>
            ))}
          </div>

          {/* Cart */}
          <div className="mt-3 rounded-lg bg-surface-container-low border border-border min-h-[104px] max-h-[140px] overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-on-surface-variant/50 text-sm px-3 py-4 text-center">
                Escaneá algo para empezar la venta
              </p>
            ) : (
              <div className="divide-y divide-border">
                {cart.map((line) => (
                  <div
                    key={line.code}
                    className="flex items-center justify-between px-3 py-2 text-sm animate-fade-in"
                  >
                    <span className="text-on-surface truncate pr-2">
                      {line.qty > 1 ? `${line.qty}× ` : ""}
                      {line.name}
                    </span>
                    <span className="text-teal font-mono font-semibold whitespace-nowrap">
                      {formatARS(line.price * line.qty)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-on-surface-variant text-sm font-semibold">Total</span>
            <span className="led-display text-2xl font-extrabold">{formatARS(total)}</span>
          </div>
        </div>

        {/* Quick codes */}
        <div className="grid grid-cols-2 gap-1.5 px-4 pt-3 bg-surface-container-lowest">
          {Object.entries(CATALOG).map(([code, product]) => (
            <button
              key={code}
              onClick={() => addByCode(code)}
              className="flex items-center justify-between gap-2 text-left text-xs bg-surface-container border border-border rounded-lg px-2.5 py-2 hover:border-primary-light transition-colors"
            >
              <span className="text-on-surface-variant truncate">{product.name}</span>
              <span className="font-mono text-accent-light">{code}</span>
            </button>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-1.5 p-4 pt-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => pressDigit(d)}
              className="py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono font-bold text-lg transition-colors active:scale-95"
            >
              {d}
            </button>
          ))}
          <button
            onClick={pressClear}
            className="py-2.5 rounded-lg bg-surface-container-high hover:bg-red-900/40 text-red-300 font-mono font-bold text-sm transition-colors active:scale-95"
          >
            C
          </button>
          <button
            onClick={() => pressDigit("0")}
            className="py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono font-bold text-lg transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={pressCharge}
            disabled={cart.length === 0}
            className="py-2.5 rounded-lg bg-teal-container hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed text-on-teal font-bold text-sm transition-all active:scale-95"
          >
            {flash === "charged" ? "✓" : "Cobrar"}
          </button>
        </div>
      </div>

      {flash === "charged" && (
        <div
          className="absolute inset-x-4 -bottom-5 z-20 bg-teal text-on-teal font-bold text-sm text-center rounded-xl py-3 shadow-xl"
          style={{ animation: "fadeInUp 0.3s ease-out forwards" }}
        >
          🎉 Venta cobrada. Así de rápido es con Omero.
        </div>
      )}
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
    trackEvent("cta_click", { location: "hero", label: "Empezá gratis — 14 días" });
    scrollToSection("cta-final");
  }

  function handleProductCTA() {
    trackEvent("cta_click", { location: "hero", label: "Ver el producto completo" });
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

      {/* Grid overlay */}
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
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-medium px-4 py-2.5 rounded-full mb-7">
              <div className="live-dot flex-shrink-0" />
              <span className="text-accent font-bold">★★★★★</span>
              <span className="text-on-surface-variant">+50 comercios ya cobran con Omero</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.08] mb-6 tracking-tight">
              Esto no es una captura
              <br />
              de pantalla. Es tu próxima{" "}
              <span className="gradient-text">caja registradora.</span>
            </h1>

            <p className="text-xl text-on-surface-variant mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Ahí al lado hay una terminal real de Omero. Tocá un producto y
              mirá el total calcularse al instante.{" "}
              <span className="text-white font-semibold">Así de simple es vender con Omero.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button
                onClick={handlePrimaryCTA}
                className="btn-primary rounded-xl text-lg px-8 py-4 min-h-[56px] w-full sm:w-auto hover:scale-105 active:scale-95 transition-transform"
              >
                Empezá gratis — 14 días ✨
              </button>
              <button
                onClick={handleProductCTA}
                className="border-2 border-white/25 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-lg transition-all min-h-[56px] w-full sm:w-auto backdrop-blur-sm hover:scale-105 active:scale-95"
              >
                Ver el producto completo →
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
              {["Sin tarjeta", "Cancelás cuando quieras", "Soporte en español"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-on-surface-variant/70 text-sm">
                  <span className="text-teal font-bold text-base">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — interactive POS demo */}
          <div className="flex-1 w-full" style={{ animation: "fadeInUp 0.9s ease-out forwards" }}>
            <PosDemo />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-on-surface-variant/60 text-xs cursor-pointer hover:text-white transition-colors"
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
