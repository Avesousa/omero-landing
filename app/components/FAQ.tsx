"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Necesito tarjeta de crédito para el trial?",
    answer: "No. El trial de 14 días es 100% gratis, sin tarjeta de crédito.",
  },
  {
    question: "¿Puedo importar mis productos existentes?",
    answer: "Sí, podés importar por CSV o escanear con código de barras.",
  },
  {
    question: "¿Los precios son en pesos o dólares?",
    answer: "Los precios son en pesos argentinos (ARS). Sin sorpresas en dólares.",
  },
  {
    question: "¿Qué pasa si quiero cancelar?",
    answer: "Podés cancelar en cualquier momento, sin penalidades.",
  },
  {
    question: "¿Funciona sin internet?",
    answer: "La app de escritorio funciona offline. Los cambios se sincronizan cuando volvés a conectarte.",
  },
];

function FAQItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface-container">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-surface-container-high transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-mono text-accent/70 text-sm font-bold flex-shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-semibold text-on-surface text-base flex-1">{question}</span>
        <ChevronDown
          className={`text-primary-light flex-shrink-0 w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-48" : "max-h-0"}`}
      >
        <div className="px-6 pb-5 pt-1 pl-[3.25rem] border-t border-border">
          <p className="text-on-surface-variant leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="bg-surface py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="eyebrow-chip text-teal bg-teal/10 border-teal/25">Dudas frecuentes</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mt-5">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              index={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
