const BUSINESSES = [
  "Almacén El Sol",
  "Kiosco La Esperanza",
  "Fiambrería Don Pedro",
  "Ferretería Haedo",
  "Dietética Natural",
  "Panadería Del Barrio",
  "Verdulería San Martín",
  "Librería Central",
];

export default function TrustStrip() {
  const row = [...BUSINESSES, ...BUSINESSES];

  return (
    <div className="bg-surface-container-low border-y border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        <span className="text-on-surface-variant/60 text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
          Comercios que ya dejaron las planillas
        </span>
        <div className="marquee-wrap flex-1 w-full">
          <div className="marquee-track">
            {row.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-on-surface-variant/80 font-bold text-base px-8 whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
