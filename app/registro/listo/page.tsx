"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { CheckoutShell } from "../../components/CheckoutShell";
import { trackEvent } from "../../components/Analytics";
import { billing, formatDate, type SignupResult } from "../../lib/billing";

export default function ListoPage() {
  return (
    <CheckoutShell>
      <Suspense fallback={null}>
        <Listo />
      </Suspense>
    </CheckoutShell>
  );
}

const POLL_MS = 3000;
const MAX_POLLS = 20; // ~1 minuto: después dejamos de esperar y explicamos qué pasa

/** Vuelta del alta (tarjeta) o del checkout de Mercado Pago (back_url con ?sid=). */
function Listo() {
  const sid = useSearchParams().get("sid");
  const [result, setResult] = useState<SignupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (!sid) {
      setError("No encontramos tu alta.");
      return;
    }
    let polls = 0;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const tick = async () => {
      try {
        const r = await billing.status(sid);
        if (stopped) return;
        setResult(r);
        if (r.status === "PENDING") {
          if (++polls >= MAX_POLLS) setGaveUp(true);
          else timer = setTimeout(tick, POLL_MS);
        } else if (r.status === "TRIALING" || r.status === "ACTIVE") {
          trackEvent("signup_completed", { plan: r.planName });
        }
      } catch (e) {
        if (!stopped) setError((e as Error).message);
      }
    };
    tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [sid]);

  const card = "mx-auto max-w-xl rounded-2xl border border-border bg-surface p-8 text-center sm:p-10";

  if (error) {
    return (
      <div className={card}>
        <h1 className="text-2xl font-extrabold">Algo no salió bien</h1>
        <p className="mt-3 text-on-surface-variant">{error}</p>
        <Link href="/registro" className="btn-primary mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-bold">Volver a intentar</Link>
      </div>
    );
  }

  if (!result || (result.status === "PENDING" && !gaveUp)) {
    return (
      <div className={card} aria-live="polite">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-border border-t-accent" aria-hidden />
        <h1 className="mt-6 text-xl font-extrabold">Confirmando tu suscripción…</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Estamos esperando la confirmación de Mercado Pago. No cierres esta página.</p>
      </div>
    );
  }

  if (result.status === "PENDING") {
    return (
      <div className={card}>
        <h1 className="text-2xl font-extrabold">Falta autorizar el pago</h1>
        <p className="mt-3 text-on-surface-variant">
          Tu cuenta de Omero ya está creada, pero Mercado Pago todavía no confirmó la suscripción.
          Si ya la autorizaste, puede demorar unos minutos.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {result.checkoutUrl && (
            <a href={result.checkoutUrl} className="btn-primary rounded-xl px-6 py-3 text-sm font-bold">Ir a Mercado Pago</a>
          )}
          <a href={result.omeroAppUrl} className="rounded-xl border border-border-2 px-6 py-3 text-sm font-bold">Entrar a Omero</a>
        </div>
      </div>
    );
  }

  if (result.status === "FAILED") {
    return (
      <div className={card}>
        <h1 className="text-2xl font-extrabold">No se completó la suscripción</h1>
        <p className="mt-3 text-on-surface-variant">
          No se hizo ningún cobro. Si tu cuenta de Omero ya se creó, podés suscribirte desde Omero → Suscripción.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={result.omeroAppUrl} className="btn-primary rounded-xl px-6 py-3 text-sm font-bold">Entrar a Omero</a>
          <Link href="/registro" className="rounded-xl border border-border-2 px-6 py-3 text-sm font-bold">Empezar de nuevo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={card}>
      <div aria-hidden className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-teal text-2xl text-teal">✓</div>
      <h1 className="mt-5 text-2xl font-extrabold">¡Listo! Tu negocio ya está en Omero</h1>
      <p className="mt-3 text-on-surface-variant">
        Activamos el plan <strong className="text-on-surface">{result.planName}</strong>
        {result.trialEndsAt ? (
          <> con prueba gratis hasta el <strong className="text-on-surface">{formatDate(result.trialEndsAt)}</strong>. No se cobra nada hasta esa fecha.</>
        ) : (
          "."
        )}
      </p>
      <p className="mt-2 text-sm text-text-muted">Entrá con el email y la contraseña que elegiste.</p>
      <a href={result.omeroAppUrl} className="btn-primary mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-bold">Entrar a Omero</a>
    </div>
  );
}
