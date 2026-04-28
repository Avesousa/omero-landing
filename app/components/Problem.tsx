const problems = [
  {
    icon: "📦",
    title: "Sin control de inventario",
    description: "Perdés ventas y plata sin darte cuenta — sin saber qué hay en el depósito.",
    accent: "from-red-500 to-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    badgeColor: "text-red-500 bg-red-50",
    stat: "72%",
    statLabel: "de comercios sin control real",
  },
  {
    icon: "💰",
    title: "Márgenes confusos",
    description: "Los precios cambian todo el tiempo y no sabés tu margen real en cada producto.",
    accent: "from-orange-500 to-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    badgeColor: "text-amber-600 bg-amber-50",
    stat: "3 hs",
    statLabel: "promedio perdidas por semana",
  },
  {
    icon: "📋",
    title: "Planillas que no escalan",
    description: "Excel y cuadernos no pueden con el ritmo de un comercio activo. Se quedan cortos.",
    accent: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badgeColor: "text-blue-600 bg-blue-50",
    stat: "1 de 2",
    statLabel: "negocios usa papel todavía",
  },
];

export default function Problem() {
  return (
    <section id="problema" className="relative bg-gray-50 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #EF4444, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-red-500 font-semibold text-sm uppercase tracking-wider mb-3 px-4 py-1.5 bg-red-50 rounded-full border border-red-100">
            ¿Esto te pasa a vos?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-6">
            ¿Te suena familiar?
          </h2>
          <p className="text-lg text-medium max-w-2xl mx-auto leading-relaxed">
            ¿Cuántas veces perdiste una venta porque no sabías si tenías stock?
            ¿Cuántas horas perdiste haciendo inventario a mano? ¿Cuántos
            productos vendiste <strong className="text-dark">sin saber si te dejaban ganancia?</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <div
              key={problem.title}
              className={`relative bg-white rounded-2xl p-8 shadow-sm border ${problem.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${problem.accent} rounded-t-2xl`} />

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${problem.bg} text-3xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {problem.icon}
              </div>

              <h3 className="text-xl font-bold text-dark mb-3">
                {problem.title}
              </h3>
              <p className="text-medium leading-relaxed mb-6">
                {problem.description}
              </p>

              {/* Stat */}
              <div className={`inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-full text-sm ${problem.badgeColor} border ${problem.border}`}>
                <span className="font-extrabold text-base">{problem.stat}</span>
                <span className="font-medium">{problem.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA bridge */}
        <p className="text-center text-medium mt-12 text-lg">
          Los comercios del Zona Oeste que dan el salto,{" "}
          <strong className="text-dark">no vuelven a las planillas.</strong>
        </p>
      </div>
    </section>
  );
}
