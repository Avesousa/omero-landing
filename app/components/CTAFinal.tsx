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
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary-light"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Tu negocio no puede esperar más.
        </h2>
        <p className="text-xl text-blue-100 mb-10">
          Empezá hoy con 14 días gratis — sin riesgos, sin tarjeta, sin
          complicaciones.
        </p>

        {success ? (
          <div className="bg-white rounded-2xl p-10 shadow-xl">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-dark mb-2">
              ¡Estás a un paso!
            </h3>
            <p className="text-medium">
              Te abrimos WhatsApp para coordinar tu acceso gratuito. Si no se
              abrió automáticamente, revisá que no esté bloqueado por tu
              navegador.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-xl"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-dark placeholder-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 min-h-[48px]"
              />
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="+54 9 11 ..."
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-dark placeholder-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 min-h-[48px]"
              />
              <select
                name="rubro"
                value={form.rubro}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 min-h-[48px] bg-white"
              >
                <option value="" disabled>
                  Rubro del negocio
                </option>
                {rubros.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-left">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-yellow-400 text-dark font-bold py-4 rounded-xl text-lg transition-colors min-h-[56px] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Enviando..." : "Quiero empezar →"}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6">
              {["Sin tarjeta", "14 días gratis", "Cancelá cuando quieras"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-medium text-sm"
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
