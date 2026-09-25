"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Check, CreditCard, Wallet } from "lucide-react";
import { CheckoutShell } from "../components/CheckoutShell";
import { MpCardBrick } from "../components/MpCardBrick";
import { trackEvent } from "../components/Analytics";
import { billing, BillingError, formatARS, formatDate, type BillingPlan, type PaymentMode } from "../lib/billing";

export default function RegistroPage() {
  return (
    <CheckoutShell>
      <Suspense fallback={<div className="mx-auto h-96 max-w-xl animate-pulse rounded-2xl bg-surface" />}>
        <Registro />
      </Suspense>
    </CheckoutShell>
  );
}

interface Account {
  businessName: string;
  email: string;
  password: string;
}

function Registro() {
  const params = useSearchParams();
  const router = useRouter();
  const [plans, setPlans] = useState<BillingPlan[] | null>(null);
  const [planId, setPlanId] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [step, setStep] = useState<"account" | "payment">("account");
  const [mode, setMode] = useState<PaymentMode>("CARD");
  const [account, setAccount] = useState<Account>({ businessName: "", email: "", password: "" });
  const [payerEmail, setPayerEmail] = useState("");
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([billing.plans(), billing.config()])
      .then(([all, cfg]) => {
        setPlans(all);
        setPublicKey(cfg.mpPublicKey);
        const code = params.get("plan")?.toUpperCase();
        const interval = params.get("intervalo")?.toUpperCase() === "ANNUAL" ? "ANNUAL" : "MONTHLY";
        const initial =
          all.find((p) => p.code === code && p.interval === interval) ??
          all.find((p) => p.code === "PRO" && p.interval === interval) ??
          all[0];
        if (initial) setPlanId(initial.id);
      })
      .catch((e: Error) => setError({ message: e.message }));
  }, [params]);

  const plan = useMemo(() => plans?.find((p) => p.id === planId) ?? null, [plans, planId]);
  const trialEnd = plan && plan.trialDays > 0 ? new Date(Date.now() + plan.trialDays * 86_400_000).toISOString() : null;

  function continueToPayment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (account.password.length < 8) {
      setError({ message: "La contraseña debe tener al menos 8 caracteres" });
      return;
    }
    setPayerEmail((current) => current || account.email);
    trackEvent("signup_account_completed", { plan: plan?.code ?? "" });
    setStep("payment");
  }

  async function submit(paymentMode: PaymentMode, cardToken?: string) {
    if (!plan) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await billing.signup({
        planId: plan.id,
        ...account,
        paymentMode,
        cardToken,
        payerEmail: paymentMode === "MP_CHECKOUT" ? payerEmail || account.email : undefined,
      });
      trackEvent("signup_submitted", { plan: plan.code, mode: paymentMode });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl; // checkout de Mercado Pago; vuelve a /registro/listo
        return;
      }
      router.push(`/registro/listo?sid=${encodeURIComponent(result.subscriptionId)}`);
    } catch (e) {
      const err = e as BillingError;
      setError({ message: err.message, code: err.code });
      if (err.code === "EMAIL_TAKEN" || err.code === "VALIDATION_ERROR") setStep("account");
      setSubmitting(false);
    }
  }

  if (!plans && !error) return <div className="mx-auto h-96 max-w-xl animate-pulse rounded-2xl bg-surface" />;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <ol className="mb-6 flex gap-3 text-xs font-semibold text-text-muted">
          <li className={step === "account" ? "text-on-surface" : ""}>1. Tu negocio</li>
          <li aria-hidden>›</li>
          <li className={step === "payment" ? "text-on-surface" : ""}>2. Medio de pago</li>
        </ol>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-error p-4 text-sm text-error">
            {error.message}
          </div>
        )}

        {step === "account" ? (
          <form onSubmit={continueToPayment} className="space-y-4">
            <h1 className="text-2xl font-extrabold">Creá tu cuenta de Omero</h1>
            <Field label="Nombre del negocio">
              <input className="checkout-input" required maxLength={120} autoComplete="organization"
                value={account.businessName} onChange={(e) => setAccount({ ...account, businessName: e.target.value })} />
            </Field>
            <Field label="Email" hint="Con este email vas a entrar a Omero.">
              <input className="checkout-input" type="email" required autoComplete="email"
                value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
            </Field>
            <Field label="Contraseña" hint="Mínimo 8 caracteres.">
              <input className="checkout-input" type="password" required minLength={8} autoComplete="new-password"
                value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} />
            </Field>
            <button type="submit" className="btn-primary w-full rounded-xl py-3.5 text-sm font-bold" disabled={!plan}>
              Continuar
            </button>
            <p className="text-center text-sm text-text-muted">
              ¿Ya tenés cuenta? Gestioná tu plan desde Omero → Suscripción.
            </p>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold">¿Cómo querés pagar?</h1>
              <button className="text-sm font-semibold text-on-surface-variant hover:text-on-surface"
                onClick={() => setStep("account")} disabled={submitting}>
                ← Volver
              </button>
            </div>

            {plan && plan.trialDays > 0 && (
              <p className="rounded-xl border border-teal p-3 text-sm text-on-surface-variant">
                <strong className="text-on-surface">Hoy no se cobra nada.</strong> El primer cobro de {formatARS(plan.price)} es el{" "}
                {formatDate(trialEnd)}. Podés cancelar antes desde Omero → Suscripción.
              </p>
            )}

            <div role="radiogroup" aria-label="Medio de pago" className="grid gap-3 sm:grid-cols-2">
              <ModeOption selected={mode === "CARD"} onSelect={() => setMode("CARD")} icon={<CreditCard size={18} />}
                title="Tarjeta" subtitle="Crédito o débito. Sin salir de esta página." />
              <ModeOption selected={mode === "MP_CHECKOUT"} onSelect={() => setMode("MP_CHECKOUT")} icon={<Wallet size={18} />}
                title="Mercado Pago" subtitle="Dinero en cuenta o tus tarjetas guardadas." />
            </div>

            <div className={submitting ? "pointer-events-none opacity-60" : ""}>
              {mode === "CARD" && plan && publicKey && (
                <MpCardBrick
                  publicKey={publicKey}
                  amount={plan.price}
                  payerEmail={account.email}
                  submitLabel={plan.trialDays > 0 ? "Empezar prueba gratis" : "Suscribirme"}
                  onToken={(token) => submit("CARD", token)}
                />
              )}
              {mode === "CARD" && !publicKey && (
                <p className="rounded-xl border border-error p-4 text-sm text-error">El pago con tarjeta no está disponible en este momento.</p>
              )}

              {mode === "MP_CHECKOUT" && (
                <div className="space-y-4">
                  <Field label="Email de tu cuenta de Mercado Pago"
                    hint="Tiene que ser el email con el que entrás a Mercado Pago (puede ser distinto al de Omero).">
                    <input className="checkout-input" type="email" required autoComplete="email"
                      value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} />
                  </Field>
                  <button className="btn-primary w-full rounded-xl py-3.5 text-sm font-bold" disabled={submitting || !payerEmail}
                    onClick={() => submit("MP_CHECKOUT")}>
                    {submitting ? "Creando tu cuenta…" : "Continuar a Mercado Pago"}
                  </button>
                  <p className="text-xs text-text-muted">
                    Vas a autorizar la suscripción en Mercado Pago y volver acá. Si pagás con dinero en cuenta, tené saldo el día del cobro.
                  </p>
                </div>
              )}
            </div>
            {submitting && mode === "CARD" && <p className="text-center text-sm text-on-surface-variant">Creando tu cuenta…</p>}
          </div>
        )}
      </section>

      <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-text-muted">Tu plan</h2>
        {plans && (
          <select className="checkout-input mt-3" value={planId} onChange={(e) => setPlanId(e.target.value)} disabled={submitting}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.interval === "ANNUAL" ? "Anual" : "Mensual"}
              </option>
            ))}
          </select>
        )}
        {plan && (
          <>
            <p className="mt-5 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold">{formatARS(plan.price)}</span>
              <span className="text-xs text-text-muted">{plan.interval === "ANNUAL" ? "/ año" : "/ mes"}</span>
            </p>
            {plan.trialDays > 0 && <p className="mt-1 text-xs font-bold text-teal">{plan.trialDays} días gratis</p>}
            <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-on-surface-variant">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check size={16} className="mt-0.5 flex-shrink-0 text-teal" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="mt-6 border-t border-border pt-4 text-xs text-text-muted">
          <Link href="/#pricing" className="underline">Comparar planes</Link>
        </p>
      </aside>
    </div>
  );
}

function ModeOption({ selected, onSelect, icon, title, subtitle }: {
  selected: boolean; onSelect: () => void; icon: React.ReactNode; title: string; subtitle: string;
}) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect}
      className={`flex gap-3 rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-accent bg-surface-high" : "border-border-2 hover:bg-surface-high"
      }`}>
      <span className={selected ? "text-accent" : "text-text-muted"}>{icon}</span>
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-xs text-text-muted">{subtitle}</span>
      </span>
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}
    </label>
  );
}
