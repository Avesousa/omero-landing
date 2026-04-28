const benefits = [
  {
    emoji: "📦",
    title: "Control de stock",
    description: "Sabés qué tenés sin contar físicamente. Alerta automática cuando el stock es bajo.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    emoji: "💰",
    title: "Márgenes automáticos",
    description: "Nunca más vendés a pérdida sin saberlo. El sistema calcula tu ganancia en tiempo real.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    emoji: "🏷️",
    title: "Etiquetas de precios",
    description: "Actualizás todos los precios en minutos. Un cambio, todos los carteles actualizados.",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    emoji: "📱",
    title: "App desktop + web",
    description: "Usás desde la caja o desde el celular. Funciona sin internet en la app desktop.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    emoji: "📊",
    title: "Importación CSV",
    description: "Cargás todo tu catálogo en minutos desde una planilla. Sin re-tipear nada.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    emoji: "🔍",
    title: "Código de barras",
    description: "Escaneás y listo. Sin errores de tipeo, sin perder tiempo buscando el producto.",
    gradient: "from-sky-500 to-cyan-500",
  },
];

export default function Benefits() {
  return (
    <section
      id="beneficios"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f1f5c 0%, #1E3A5F 40%, #1e3a8a 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-white bg-opacity-10 rounded-full border border-white border-opacity-20">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Todo lo que tu negocio necesita
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Sin funciones innecesarias. Sin curva de aprendizaje. Solo lo que usás todos los días.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className="group relative bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-2xl p-7 hover:bg-opacity-10 hover:border-opacity-25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${benefit.gradient}`}
                style={{ opacity: 0, filter: "blur(20px)", zIndex: -1 }}
              />

              {/* Icon with gradient background */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {benefit.emoji}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-blue-200 leading-relaxed text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { value: "+50", label: "comercios en Zona Oeste" },
            { value: "10 min", label: "promedio de onboarding" },
            { value: "98%", label: "satisfacción del usuario" },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-6 bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10">
              <p className="text-4xl font-extrabold gradient-text mb-1">{stat.value}</p>
              <p className="text-blue-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
