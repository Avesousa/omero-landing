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
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl font-extrabold text-primary tracking-tight focus:outline-none"
          >
            Omero
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("solucion")}
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              Producto
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              Precios
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={handleCTA}
              className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-light transition-colors min-h-[48px]"
            >
              Empezá gratis
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
            aria-label="Abrir menú"
          >
            <span
              className={`block w-6 h-0.5 bg-dark transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-dark transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-dark transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="flex flex-col px-4 py-4 gap-4">
            <button
              onClick={() => {
                scrollToSection("solucion");
                setMenuOpen(false);
              }}
              className="text-left text-dark font-medium py-2"
            >
              Producto
            </button>
            <button
              onClick={() => {
                scrollToSection("pricing");
                setMenuOpen(false);
              }}
              className="text-left text-dark font-medium py-2"
            >
              Precios
            </button>
            <button
              onClick={() => {
                scrollToSection("faq");
                setMenuOpen(false);
              }}
              className="text-left text-dark font-medium py-2"
            >
              FAQ
            </button>
            <button
              onClick={handleCTA}
              className="bg-primary text-white font-semibold px-5 py-3 rounded-lg text-center w-full min-h-[48px]"
            >
              Empezá gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
