"use client";

import { useState } from "react";
import { trackEvent } from "./Analytics";

const rubros = [
  "Kiosco",
  "Almacén",
  "Supermercado",
  "Ferretería",
  "Ropa y calzado",
  "Farmacia",
  "Otro",
];

interface FormState {
  nombre: string;
  whatsapp: string;
  rubro: string;
}

export default function CTAFinal() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    whatsapp: "",
    rubro: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.nombre.trim() || !form.whatsapp.trim() || !form.rubro) {
      setError("Por favor completá todos los campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al enviar el formulario.");
      }

      trackEvent("form_submit", { rubro: form.rubro });
      setSuccess(true);

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Algo salió mal. Intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="cta-final"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1E40AF 50%, #2563eb 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientShift 8s ease infinite",
      }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }} />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }} />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Urgency badge */}
        <div className="inline-flex items-center gap-2 bg-accent bg-opacity-20 border border-accent border-opacity-40 text-accent text-sm font-bold px-4 py-2 rounded-full mb-7">
          <span className="live-dot bg-accent" style={{ background: "#F59E0B" }} />
          <span>Plazas limitadas para onboarding personalizado este mes</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
          Tu negocio no puede
          <br />
          <span className="gradient-text">esperar más.</span>
        </h2>
        <p className="text-xl text-blue-100 mb-10 leading-relaxed">
          Empezá hoy con 14 días gratis —{" "}
          <span className="text-white font-semibold">sin riesgos, sin tarjeta, sin complicaciones.</span>
        </p>

        {success ? (
          <div className="bg-white rounded-2xl p-10 shadow-2xl">
            <div
              className="text-6xl mb-4"
              style={{ animation: "bounceSoft 1s ease-in-out 3" }}
            >
              🎉
            </div>
            <h3 className="text-2xl font-extrabold text-dark mb-2">
              ¡Estás a un paso!
            </h3>
            <p className="text-medium text-lg leading-relaxed">
              Te abrimos WhatsApp para coordinar tu acceso gratuito. Si no se
              abrió automáticamente, revisá que no esté bloqueado por tu
              navegador.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-2xl text-left"
            noValidate
          >
            <h3 className="text-dark font-extrabold text-xl mb-6 text-center">
              Empezá tu prueba gratis en 60 segundos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-medium uppercase tracking-wider mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors min-h-[48px] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-medium uppercase tracking-wider mb-1.5">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+54 9 11 ..."
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-colors min-h-[48px] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-medium uppercase tracking-wider mb-1.5">
                  Rubro
                </label>
                <select
                  name="rubro"
                  value={form.rubro}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-primary transition-colors min-h-[48px] bg-white text-sm"
                >
                  <option value="" disabled>
                    Tu rubro
                  </option>
                  {rubros.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-yellow-400 text-dark font-extrabold py-4 rounded-xl text-lg transition-all min-h-[56px] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] glow-accent"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Quiero empezar — es gratis →"
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-5">
              {["Sin tarjeta de crédito", "14 días gratis", "Cancelás cuando querés"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-medium text-sm"
                  >
                    <span className="text-success font-bold">✓</span>
                    {item}
                  </span>
                )
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
