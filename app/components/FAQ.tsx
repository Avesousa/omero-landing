"use client";

import { useState } from "react";

const faqs = [
  {
    question: "¿Necesito tarjeta de crédito para el trial?",
    answer:
      "No. El trial de 14 días es 100% gratis, sin tarjeta de crédito.",
  },
  {
    question: "¿Puedo importar mis productos existentes?",
    answer:
      "Sí, podés importar por CSV o escanear con código de barras.",
  },
  {
    question: "¿Los precios son en pesos o dólares?",
    answer:
      "Los precios están en USD con equivalente en pesos actualizado.",
  },
  {
    question: "¿Qué pasa si quiero cancelar?",
    answer:
      "Podés cancelar en cualquier momento, sin penalidades.",
  },
  {
    question: "¿Funciona sin internet?",
    answer:
      "La app de escritorio funciona offline. Los cambios se sincronizan cuando volvés a conectarte.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-light transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-dark text-base pr-4">{question}</span>
        <span
          className={`text-primary flex-shrink-0 text-xl font-light transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-48" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-5 pt-2 bg-white border-t border-gray-100">
          <p className="text-medium leading-relaxed">{answer}</p>
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
    <section id="faq" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-dark text-center mb-12">
          Preguntas frecuentes
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
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
