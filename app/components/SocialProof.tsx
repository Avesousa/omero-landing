const testimonials = [
  {
    initials: "JP",
    name: "Juan P.",
    business: "Almacén El Sol",
    location: "Morón, Zona Oeste",
    rating: 5,
    quote:
      "Antes tardaba 2 horas en actualizar precios. Ahora lo hago en 10 minutos con Omero.",
    highlight: "2 horas → 10 minutos",
    color: "from-blue-500 to-blue-600",
  },
  {
    initials: "MG",
    name: "María G.",
    business: "Kiosco La Esperanza",
    location: "Haedo, Zona Oeste",
    rating: 5,
    quote:
      "El precio posta de cada producto, siempre a mano. Ya no pierdo plata en cada venta.",
    highlight: "Cero pérdidas por precio",
    color: "from-emerald-500 to-green-600",
  },
];

const trustBadges = [
  { icon: "🔒", text: "Datos seguros y encriptados" },
  { icon: "💬", text: "Soporte en español 24/7" },
  { icon: "🚫", text: "Sin contrato de permanencia" },
  { icon: "📱", text: "Funciona desde el celular" },
];

export default function SocialProof() {
  return (
    <section id="testimonios" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-success font-semibold text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-green-50 rounded-full border border-green-100">
            Testimoniales reales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            Comercios como el tuyo ya lo usan
          </h2>
          <p className="text-medium text-lg max-w-xl mx-auto">
            Resultados reales de comerciantes de Zona Oeste que dieron el salto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.color}`} />

              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-6xl font-serif text-gray-100 leading-none select-none">
                &ldquo;
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-md`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-dark">{t.name}</p>
                  <p className="text-medium text-sm">{t.business}</p>
                  <p className="text-medium text-xs flex items-center gap-1">
                    <span>📍</span>{t.location}
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-accent text-lg">★</span>
                    ))}
                  </div>
                  <span className="text-xs text-medium mt-0.5">Verificado</span>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-dark text-lg leading-relaxed italic mb-5 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Result badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 text-success text-sm font-bold px-4 py-2 rounded-full border border-green-100">
                <span>✓</span>
                <span>{t.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
          <p className="text-center text-dark font-semibold text-lg mb-6">
            Diseñado para que puedas confiar
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.text}
                className="flex flex-col items-center gap-2 text-center bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-dark text-sm font-medium leading-snug">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
