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
      className="relative bg-gradient-to-br from-primary to-primary-light min-h-screen flex items-center pt-16"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-white opacity-5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="text-accent">★★★★★</span>
              <span>+50 comercios lo usan</span>
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Tu negocio merece herramientas serias.{" "}
              <span className="text-accent">Omero te las da.</span>
            </h1>

            <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto lg:mx-0">
              Controlá inventario, márgenes y precios desde cualquier
              dispositivo. Sin complicaciones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handlePrimaryCTA}
                className="bg-accent hover:bg-yellow-400 text-dark font-bold px-8 py-4 rounded-xl text-lg transition-colors min-h-[56px] shadow-lg w-full sm:w-auto"
              >
                Empezá gratis — 14 días
              </button>
              <button
                onClick={handleDemoCTA}
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-xl text-lg transition-colors min-h-[56px] w-full sm:w-auto"
              >
                Ver demo
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl border border-white border-opacity-20 p-4 shadow-2xl">
              <div className="bg-dark rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-gray-400 text-xs ml-2">
                    Omero Dashboard
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Productos", value: "1.284", color: "text-primary-light" },
                    { label: "Margen prom.", value: "38%", color: "text-success" },
                    { label: "Ventas hoy", value: "$48.200", color: "text-accent" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-gray-800 rounded-lg p-3 text-center"
                    >
                      <p className={`text-lg font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Coca-Cola 500ml", stock: "48 u.", margin: "32%", ok: true },
                    { name: "Aceite 1L Natura", stock: "12 u.", margin: "18%", ok: true },
                    { name: "Harina 1kg", stock: "3 u.", margin: "22%", ok: false },
                    { name: "Detergente 500ml", stock: "27 u.", margin: "41%", ok: true },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
                    >
                      <span className="text-white text-xs font-medium truncate flex-1">
                        {item.name}
                      </span>
                      <span className="text-gray-400 text-xs mx-3">
                        {item.stock}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          item.ok ? "text-success" : "text-red-400"
                        }`}
                      >
                        {item.margin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
