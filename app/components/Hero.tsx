"use client";

import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  function handlePrimaryCTA() {
    trackEvent("cta_click", { location: "hero", label: "Empezá gratis — 14 días" });
    scrollToSection("cta-final");
  }

  function handleDemoCTA() {
    trackEvent("cta_click", { location: "hero", label: "Ver demo" });
    scrollToSection("solucion");
  }

  return (
    <section
      id="hero"
      className="relative hero-bg min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            animation: "float 7s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
            animation: "float 9s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #93C5FD 0%, transparent 60%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left column — copy */}
          <div className="flex-1 text-center lg:text-left" style={{ animation: "fadeInUp 0.7s ease-out forwards" }}>
            {/* Live badge */}
            <div className="inline-flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white text-sm font-medium px-4 py-2.5 rounded-full mb-7">
              <div className="live-dot flex-shrink-0" />
              <span className="text-accent font-bold">★★★★★</span>
              <span className="text-blue-100">+50 comercios lo usan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Tu negocio merece
              <br />
              herramientas serias.{" "}
              <span className="gradient-text">Omero te las da.</span>
            </h1>

            <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Controlá inventario, márgenes y precios desde cualquier
              dispositivo.{" "}
              <span className="text-white font-semibold">Sin complicaciones.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button
                onClick={handlePrimaryCTA}
                className="glow-accent bg-accent hover:bg-yellow-400 text-dark font-bold px-8 py-4 rounded-xl text-lg transition-all min-h-[56px] shadow-lg w-full sm:w-auto hover:scale-105 active:scale-95"
              >
                Empezá gratis — 14 días ✨
              </button>
              <button
                onClick={handleDemoCTA}
                className="border-2 border-white border-opacity-50 text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-xl text-lg transition-all min-h-[56px] w-full sm:w-auto backdrop-blur-sm hover:scale-105 active:scale-95"
              >
                Ver demo →
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
              {["Sin tarjeta", "Cancelás cuando quieras", "Soporte en español"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-blue-200 text-sm">
                  <span className="text-success font-bold text-base">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — dashboard mockup */}
          <div
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
            style={{ animation: "fadeInUp 0.9s ease-out forwards" }}
          >
            {/* Floating stock alert notification */}
            <div
              className="absolute -top-4 -left-4 z-10 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 text-sm font-medium text-dark border border-gray-100"
              style={{ animation: "float 5s ease-in-out infinite", minWidth: "200px" }}
            >
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-bold text-red-500 text-xs">⚠ Stock bajo</p>
                <p className="text-dark text-xs">Harina 1kg — quedan 3 u.</p>
              </div>
            </div>

            {/* Floating revenue notification */}
            <div
              className="absolute -bottom-4 -right-4 z-10 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 text-sm border border-gray-100"
              style={{ animation: "float 6s ease-in-out infinite 1s", minWidth: "190px" }}
            >
              <span className="text-2xl">💸</span>
              <div>
                <p className="text-success font-bold text-xs">+$8.400 hoy</p>
                <p className="text-medium text-xs">Ventas en tiempo real</p>
              </div>
            </div>

            {/* Main dashboard card */}
            <div className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 p-4 shadow-2xl">
              {/* Window chrome */}
              <div className="bg-dark rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-gray-400 text-xs ml-2 font-medium">
                      Omero — Dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="live-dot" />
                    <span className="text-success text-xs">En vivo</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Productos", value: "1.284", color: "text-primary-light", trend: "+12" },
                    { label: "Margen prom.", value: "38%", color: "text-success", trend: "+3%" },
                    { label: "Ventas hoy", value: "$48.200", color: "text-accent", trend: "+18%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-gray-800 rounded-xl p-3 text-center hover:bg-gray-750 transition-colors"
                    >
                      <p className={`text-lg font-extrabold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                      <p className="text-success text-xs font-medium mt-1">↑ {stat.trend}</p>
                    </div>
                  ))}
                </div>

                {/* Product list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Producto</span>
                    <div className="flex gap-6">
                      <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Stock</span>
                      <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Margen</span>
                    </div>
                  </div>
                  {[
                    { name: "Coca-Cola 500ml", stock: "48 u.", margin: "32%", ok: true },
                    { name: "Aceite 1L Natura", stock: "12 u.", margin: "18%", ok: true },
                    { name: "Harina 1kg", stock: "3 u.", margin: "22%", ok: false },
                    { name: "Detergente 500ml", stock: "27 u.", margin: "41%", ok: true },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                        item.ok ? "bg-gray-800 hover:bg-gray-750" : "bg-red-900 bg-opacity-30 border border-red-800 border-opacity-40"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.ok ? "bg-success" : "bg-red-400"}`} />
                        <span className="text-white text-xs font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-gray-400 text-xs w-10 text-right">
                          {item.stock}
                        </span>
                        <span
                          className={`text-xs font-bold w-10 text-right ${
                            item.ok ? "text-success" : "text-red-400"
                          }`}
                        >
                          {item.margin}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-300 text-xs cursor-pointer hover:text-white transition-colors"
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
