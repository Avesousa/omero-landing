const problems = [
  {
    icon: "📦",
    title: "Sin control de inventario",
    description: "Perdés ventas y plata sin darte cuenta — sin saber qué hay en el depósito.",
    stat: "72%",
    statLabel: "de comercios sin control real",
    tone: "text-red-400 border-red-500/25 bg-red-500/10",
  },
  {
    icon: "💰",
    title: "Márgenes confusos",
    description: "Los precios cambian todo el tiempo y no sabés tu margen real en cada producto.",
    stat: "3 hs",
    statLabel: "promedio perdidas por semana",
    tone: "text-amber-400 border-amber-500/25 bg-amber-500/10",
  },
  {
    icon: "📋",
    title: "Planillas que no escalan",
    description: "Excel y cuadernos no pueden con el ritmo de un comercio activo. Se quedan cortos.",
    stat: "1 de 2",
    statLabel: "negocios usa papel todavía",
    tone: "text-primary-light border-blue-500/25 bg-blue-500/10",
  },
];

export default function Problem() {
  return (
    <section id="problema" className="relative bg-surface py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full ambient-blob-orange" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full ambient-blob-blue" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow-chip text-red-300 bg-red-500/10 border-red-500/25">
            ¿Esto te pasa a vos?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 mt-5">
            ¿Te suena familiar?
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            ¿Cuántas veces perdiste una venta porque no sabías si tenías stock?
            ¿Cuántas horas perdiste haciendo inventario a mano? ¿Cuántos
            productos vendiste <strong className="text-white">sin saber si te dejaban ganancia?</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bento-card rounded-2xl p-8 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high text-3xl mb-5">
                {problem.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
              <p className="text-on-surface-variant leading-relaxed mb-6">{problem.description}</p>

              <div className={`inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-full text-sm border ${problem.tone}`}>
                <span className="font-extrabold text-base font-mono">{problem.stat}</span>
                <span className="font-medium">{problem.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-on-surface-variant mt-12 text-lg">
          Los comercios que dan el salto,{" "}
          <strong className="text-white">no vuelven a las planillas.</strong>
        </p>
      </div>
    </section>
  );
}
