const benefits = [
  {
    emoji: "📦",
    title: "Control de stock",
    description: "Sabés qué tenés sin contar físicamente",
  },
  {
    emoji: "💰",
    title: "Márgenes automáticos",
    description: "Nunca más vendés a pérdida sin saberlo",
  },
  {
    emoji: "🏷️",
    title: "Etiquetas de precios",
    description: "Actualizás todos los precios en minutos",
  },
  {
    emoji: "📱",
    title: "App desktop + web",
    description: "Usás desde la caja o desde el celular",
  },
  {
    emoji: "📊",
    title: "Importación CSV",
    description: "Cargás todo tu catálogo en minutos",
  },
  {
    emoji: "🔍",
    title: "Código de barras",
    description: "Escaneás y listo, sin errores de tipeo",
  },
];

export default function Benefits() {
  return (
    <section
      id="beneficios"
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#1E3A5F" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-12">
          Todo lo que tu negocio necesita
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-15 transition-all"
            >
              <div className="text-4xl mb-4">{benefit.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-blue-200 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
