"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { trackEvent } from "./Analytics";
import ThemeToggle from "./ThemeToggle";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const links = [
  { label: "Producto", target: "solucion" },
  { label: "Componentes", target: "showcase" },
  { label: "Comparación", target: "comparacion" },
  { label: "Precios", target: "pricing" },
  { label: "FAQ", target: "faq" },
];

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
    trackEvent("cta_click", { location: "navbar", label: "Empezar gratis" });
    scrollToSection("cta-final");
    setMenuOpen(false);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-surface/85 backdrop-blur-md border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 focus:outline-none group"
          >
            <svg width="30" height="30" viewBox="0 0 48 48" className="group-hover:drop-shadow-[0_0_10px_rgba(30,64,175,0.6)] transition-all">
              <rect width="48" height="48" rx="10" fill="#1E40AF" />
              <circle cx="24" cy="25" r="11" fill="none" stroke="white" strokeWidth="6" />
              <polygon points="24,7 29,14 19,14" fill="white" />
            </svg>
            <span className="text-xl font-extrabold tracking-tight text-on-surface">omero</span>
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {links.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
            <ThemeToggle />
            <button
              onClick={handleCTA}
              className="btn-primary inline-flex items-center justify-center whitespace-nowrap text-sm px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Empezar gratis
            </button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-9 h-9 text-on-surface focus:outline-none"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="flex flex-col px-4 py-4 gap-1">
            {links.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  scrollToSection(item.target);
                  setMenuOpen(false);
                }}
                className="text-left text-on-surface font-medium py-3 px-2 rounded-xl hover:bg-surface-container-high transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleCTA}
              className="btn-primary inline-flex items-center justify-center whitespace-nowrap text-center w-full py-3.5 rounded-xl mt-2"
            >
              Empezar gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
