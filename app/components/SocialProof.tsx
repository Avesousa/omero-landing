const testimonials = [
  {
    initials: "JP",
    name: "Juan P.",
    business: "Almacén El Sol",
    rating: "★★★★★",
    quote:
      "Antes tardaba 2 horas en actualizar precios. Ahora lo hago en 10 minutos con Omero.",
  },
  {
    initials: "MG",
    name: "María G.",
    business: "Kiosco La Esperanza",
    rating: "★★★★★",
    quote:
      "El precio posta de cada producto, siempre a mano. Ya no pierdo plata en cada venta.",
  },
];

const trustBadges = [
  "✓ Datos seguros",
  "✓ Soporte en español",
  "✓ Sin contrato de permanencia",
];

export default function SocialProof() {
  return (
    <section id="testimonios" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-dark text-center mb-12">
          Comercios como el tuyo ya lo usan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-light rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-dark">{t.name}</p>
                  <p className="text-medium text-sm">{t.business}</p>
                  <p className="text-accent text-sm">{t.rating}</p>
                </div>
              </div>
              <blockquote className="text-dark text-lg leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          {trustBadges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-dark font-semibold"
            >
              <span className="text-success text-lg">{badge.slice(0, 1)}</span>
              <span>{badge.slice(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
