"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "./Analytics";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleCTA() {
    trackEvent("cta_click", { location: "navbar", label: "Empezá gratis" });
    scrollToSection("cta-final");
    setMenuOpen(false);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`text-2xl font-extrabold tracking-tight focus:outline-none transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            Omero
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Producto", target: "solucion" },
              { label: "Beneficios", target: "beneficios" },
              { label: "Precios", target: "pricing" },
              { label: "FAQ", target: "faq" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className={`font-medium transition-colors hover:text-primary ${
                  scrolled ? "text-dark" : "text-blue-100 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleCTA}
              className={`font-bold px-5 py-2.5 rounded-xl transition-all min-h-[44px] hover:scale-105 active:scale-95 ${
                scrolled
                  ? "bg-primary text-white hover:bg-primary-light shadow-sm"
                  : "bg-accent text-dark hover:bg-yellow-400 shadow-md glow-accent"
              }`}
            >
              Empezá gratis ✨
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden flex flex-col gap-1.5 p-2 focus:outline-none transition-colors ${
              scrolled ? "text-dark" : "text-white"
            }`}
            aria-label="Abrir menú"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-dark" : "bg-white"
              } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-dark" : "bg-white"
              } ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-dark" : "bg-white"
              } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="flex flex-col px-4 py-4 gap-1">
            {[
              { label: "Producto", target: "solucion" },
              { label: "Beneficios", target: "beneficios" },
              { label: "Precios", target: "pricing" },
              { label: "FAQ", target: "faq" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  scrollToSection(item.target);
                  setMenuOpen(false);
                }}
                className="text-left text-dark font-medium py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleCTA}
              className="bg-primary text-white font-bold px-5 py-3.5 rounded-xl text-center w-full min-h-[48px] mt-2 hover:bg-primary-light transition-colors"
            >
              Empezá gratis ✨
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
