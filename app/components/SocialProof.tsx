import { ArrowRight, Ban, MessageCircle, ShieldCheck, Smartphone, Star } from "lucide-react";

const testimonials = [
  {
    initials: "JP",
    name: "Juan P.",
    business: "Almacén El Sol",
    location: "Morón, Zona Oeste",
    rating: 5,
    quote: "Antes tardaba 2 horas en actualizar precios. Ahora lo hago en 10 minutos con Omero.",
    before: "2 horas",
    after: "10 minutos",
  },
  {
    initials: "MG",
    name: "María G.",
    business: "Kiosco La Esperanza",
    location: "Haedo, Zona Oeste",
    rating: 5,
    quote: "El precio posta de cada producto, siempre a mano. Ya no pierdo plata en cada venta.",
    before: null,
    after: "Cero pérdidas por precio",
  },
];

const trustBadges = [
  { icon: ShieldCheck, text: "Datos seguros y encriptados" },
  { icon: MessageCircle, text: "Soporte en español 24/7" },
  { icon: Ban, text: "Sin contrato de permanencia" },
  { icon: Smartphone, text: "Funciona desde el celular" },
];

export default function SocialProof() {
  return (
    <section id="testimonios" className="bg-surface-container-lowest py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow-chip text-teal bg-teal/10 border-teal/25">
            Testimoniales reales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-4 mt-5">
            Comercios como el tuyo ya lo usan
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Resultados reales de comerciantes de Zona Oeste que dieron el salto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((t) => (
            <div key={t.name} className="receipt-card pt-6 px-7 pb-7 font-mono">
              <div className="flex items-center justify-between border-b border-dashed border-border pb-4 mb-4">
                <span className="text-on-surface-variant/60 text-[11px] tracking-widest uppercase">
                  Comprobante de confianza
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-accent fill-accent" />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-5 font-sans">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{t.name}</p>
                  <p className="text-on-surface-variant text-sm">{t.business} · {t.location}</p>
                </div>
              </div>

              <blockquote className="text-on-surface text-base leading-relaxed mb-5 font-sans italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                <span className="text-on-surface-variant/60 text-xs uppercase tracking-wider">Resultado</span>
                <span className="text-teal font-bold text-sm flex items-center gap-1.5">
                  {t.before && (
                    <>
                      {t.before}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                  {t.after}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bento-card rounded-2xl p-8">
          <p className="text-center text-on-surface font-semibold text-lg mb-6">
            Diseñado para que puedas confiar
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.text}
                className="flex flex-col items-center gap-2 text-center bg-surface-container-high rounded-xl p-4 border border-border"
              >
                <badge.icon className="w-6 h-6 text-teal" />
                <span className="text-on-surface text-sm font-medium leading-snug">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
