import { Fragment } from "react";
import { Check, X } from "lucide-react";

const rows = [
  { label: "Control de stock en tiempo real", excel: false, omero: true },
  { label: "Cálculo automático de márgenes", excel: false, omero: true },
  { label: "Alerta de stock bajo", excel: false, omero: true },
  { label: "Actualizar 100 precios", excel: "~2 horas", omero: "~2 minutos" },
  { label: "Funciona sin internet", excel: true, omero: true },
  { label: "Etiquetas de góndola automáticas", excel: false, omero: true },
  { label: "Accesible desde el celular", excel: false, omero: true },
  { label: "Errores de tipeo / fórmulas rotas", excel: true, omero: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="font-mono text-sm whitespace-nowrap">{value}</span>;
  }
  return value ? (
    <Check className="w-5 h-5 text-teal mx-auto" strokeWidth={2.5} />
  ) : (
    <X className="w-5 h-5 text-red-400 mx-auto" strokeWidth={2.5} />
  );
}

export default function Comparison() {
  return (
    <section id="comparacion" className="relative bg-surface py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="eyebrow-chip text-primary-light bg-blue-500/10 border-blue-500/25">
            La comparación real
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-4 mt-5">
            Tu planilla contra Omero, cara a cara
          </h2>
          <p className="text-lg text-on-surface-variant">
            Sin relato de marketing. Esto es lo que cambia en el día a día de tu comercio.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] rounded-2xl border border-border overflow-hidden shadow-2xl">
          <div className="bg-surface-container-low px-5 py-4" />
          <div className="bg-surface-container-low px-5 py-4 text-center min-w-[110px]">
            <span className="text-on-surface-variant/70 font-semibold text-sm">Planilla / Excel</span>
          </div>
          <div className="bg-surface-container-low px-5 py-4 text-center min-w-[110px] bg-primary/10 border-l border-primary/20">
            <span className="text-on-surface font-extrabold text-sm">Omero</span>
          </div>

          {rows.map((row, i) => {
            const rowBg = i % 2 === 0 ? "bg-surface" : "bg-surface-container-lowest";
            const omeroBg = i % 2 === 0 ? "bg-primary/5" : "bg-primary/10";
            return (
              <Fragment key={row.label}>
                <div className={`${rowBg} px-5 py-4 flex items-center text-on-surface text-sm sm:text-base font-medium`}>
                  {row.label}
                </div>
                <div className={`${rowBg} px-5 py-4 flex items-center justify-center text-on-surface-variant/70`}>
                  <Cell value={row.excel} />
                </div>
                <div className={`${omeroBg} px-5 py-4 flex items-center justify-center border-l border-primary/10`}>
                  <Cell value={row.omero} />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
