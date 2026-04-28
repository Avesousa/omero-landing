const problems = [
  {
    emoji: "📦",
    title: "Sin control de inventario",
    description: "Perdés ventas y plata sin darte cuenta",
  },
  {
    emoji: "💰",
    title: "Márgenes confusos",
    description:
      "Los precios cambian todo el tiempo y no sabés tu margen real",
  },
  {
    emoji: "📋",
    title: "Planillas de Excel",
    description: "Las planillas y cuadernos no escalan",
  },
];

export default function Problem() {
  return (
    <section id="problema" className="bg-light py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-6">
            ¿Te suena familiar?
          </h2>
          <p className="text-lg text-medium max-w-2xl mx-auto leading-relaxed">
            ¿Cuántas veces perdiste una venta porque no sabías si tenías stock?
            ¿Cuántas horas perdiste haciendo inventario a mano? ¿Cuántos
            productos vendiste sin saber si te dejaban ganancia?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-5xl mb-4">{problem.emoji}</div>
              <h3 className="text-xl font-bold text-dark mb-2">
                {problem.title}
              </h3>
              <p className="text-medium leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
