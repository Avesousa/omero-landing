"use client";

import { useState } from "react";
import { CheckCircle2, Check, TriangleAlert } from "lucide-react";
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #FF6B00, transparent)" }} />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #38DEBB, transparent)" }} />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent-light text-sm font-bold px-4 py-2 rounded-full mb-7">
          <span className="live-dot" style={{ background: "#FF6B00" }} />
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
          <div className="receipt-card px-8 pt-8 pb-8 mx-auto max-w-md text-left font-mono">
            <div className="text-center mb-4">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal/15 mb-3"
                style={{ animation: "bounceSoft 1s ease-in-out 2" }}
              >
                <CheckCircle2 className="w-8 h-8 text-teal" />
              </div>
              <h3 className="text-xl font-extrabold text-on-surface font-sans">¡Estás a un paso!</h3>
            </div>
            <div className="border-t border-dashed border-border pt-4 text-sm text-on-surface-variant leading-relaxed font-sans">
              Te abrimos WhatsApp para coordinar tu acceso gratuito. Si no se
              abrió automáticamente, revisá que no esté bloqueado por tu navegador.
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="receipt-card px-8 pt-8 pb-8 text-left mx-auto max-w-xl"
            noValidate
          >
            <div className="flex items-center justify-between border-b border-dashed border-border pb-4 mb-6">
              <h3 className="text-on-surface font-extrabold text-lg font-mono">Alta de comercio</h3>
              <span className="text-on-surface-variant/50 text-xs font-mono">60 seg</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant/60 uppercase tracking-wider mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="w-full bg-surface-container-low border-2 border-border rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-light transition-colors min-h-[48px] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant/60 uppercase tracking-wider mb-1.5">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="+54 9 11 ..."
                  required
                  className="w-full bg-surface-container-low border-2 border-border rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-light transition-colors min-h-[48px] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant/60 uppercase tracking-wider mb-1.5">
                  Rubro
                </label>
                <select
                  name="rubro"
                  value={form.rubro}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-low border-2 border-border rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-light transition-colors min-h-[48px] text-sm"
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
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/25">
                <TriangleAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap w-full py-4 rounded-xl text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform"
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
                "Crear mi cuenta"
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-5 border-t border-dashed border-border pt-4">
              {["Sin tarjeta de crédito", "14 días gratis", "Cancelás cuando querés"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-on-surface-variant text-sm">
                  <Check className="w-4 h-4 text-teal" strokeWidth={3} />
                  {item}
                </span>
              ))}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
