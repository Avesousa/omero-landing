"use client";

import { useEffect, useId, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    MercadoPago?: any;
  }
}

const SDK_URL = "https://sdk.mercadopago.com/js/v2";
let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (window.MercadoPago) return Promise.resolve();
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        sdkPromise = null;
        reject(new Error("No se pudo cargar Mercado Pago"));
      };
      document.head.appendChild(script);
    });
  }
  return sdkPromise;
}

/**
 * Card Payment Brick de Mercado Pago (SDK JS v2, sin dependencias npm).
 * Los datos de la tarjeta van directo a Mercado Pago; acá solo recibimos el token.
 */
export function MpCardBrick({
  publicKey,
  amount,
  payerEmail,
  submitLabel,
  onToken,
}: {
  publicKey: string;
  amount: number;
  payerEmail?: string;
  submitLabel: string;
  onToken: (token: string) => Promise<void>;
}) {
  const containerId = `mp-card-${useId().replace(/:/g, "")}`;
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let controller: { unmount: () => void } | null = null;
    let disposed = false;
    const theme = document.documentElement.getAttribute("data-theme") === "light" ? "default" : "dark";

    loadSdk()
      .then(async () => {
        if (disposed) return;
        const mp = new window.MercadoPago(publicKey, { locale: "es-AR" });
        controller = await mp.bricks().create("cardPayment", containerId, {
          initialization: { amount, payer: payerEmail ? { email: payerEmail } : undefined },
          customization: {
            paymentMethods: { maxInstallments: 1 },
            visual: { style: { theme }, texts: { formSubmit: submitLabel } },
          },
          callbacks: {
            onReady: () => !disposed && setReady(true),
            onSubmit: (formData: { token: string }) => onTokenRef.current(formData.token),
            onError: (e: unknown) => console.warn("[MpCardBrick]", e),
          },
        });
        if (disposed) controller?.unmount();
      })
      .catch((e: Error) => !disposed && setError(e.message));

    return () => {
      disposed = true;
      try {
        controller?.unmount();
      } catch {
        /* ya desmontado */
      }
    };
  }, [publicKey, amount, payerEmail, submitLabel, containerId]);

  if (error) {
    return <p className="rounded-xl border border-error p-4 text-sm text-error">{error}</p>;
  }
  return (
    <div>
      {!ready && <div className="h-72 animate-pulse rounded-2xl bg-surface-high" />}
      <div id={containerId} />
    </div>
  );
}
