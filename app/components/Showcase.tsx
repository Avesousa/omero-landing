"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  LayoutDashboard,
  MoreVertical,
  Package,
  Pencil,
  Settings,
  ShoppingCart,
  Tag,
  TrendingUp,
  Trash2,
  Wallet,
} from "lucide-react";
import { trackEvent } from "./Analytics";

type TabId = "pos" | "dashboard" | "admin";

const TABS: { id: TabId; label: string; icon: typeof ShoppingCart }[] = [
  { id: "pos", label: "Punto de Venta", icon: ShoppingCart },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admin", label: "Administración", icon: Settings },
];

function formatARS(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

/* ─── POS — teclado numérico + carrito jugables ─────────────── */

const CATALOG: Record<string, { name: string; price: number }> = {
  "247": { name: "Aceite Girasol 1,5L — Natura", price: 1740 },
  "012": { name: "Coca-Cola 500ml", price: 1200 },
  "089": { name: "Detergente Magistral 500ml", price: 1950 },
  "156": { name: "Yerba Playadito 1kg", price: 2100 },
  "133": { name: "Pan Lactal", price: 980 },
  "500": { name: "Fideos Matarazzo 500g", price: 650 },
};

const QUICK_CODES = ["247", "012", "089", "156", "133", "500"];
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

type CartItem = { code: string; name: string; price: number; qty: number };

function PosPanel() {
  const [code, setCode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const notFoundTimer = useRef<ReturnType<typeof setTimeout>>();
  const checkoutTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      clearTimeout(notFoundTimer.current);
      clearTimeout(checkoutTimer.current);
    },
    []
  );

  function submitCode(value: string) {
    const product = CATALOG[value];
    if (!product) {
      setNotFound(true);
      clearTimeout(notFoundTimer.current);
      notFoundTimer.current = setTimeout(() => setNotFound(false), 1100);
      setCode("");
      return;
    }
    setNotFound(false);
    setCart((prev) => {
      const existing = prev.find((it) => it.code === value);
      if (existing) {
        return prev.map((it) => (it.code === value ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { code: value, name: product.name, price: product.price, qty: 1 }];
    });
    trackEvent("showcase_pos_add", { code: value });
    setCode("");
  }

  function pressKey(k: string) {
    if (checkedOut) return;
    if (k === "C") {
      setCode("");
      setNotFound(false);
    } else if (k === "⌫") {
      setCode((c) => c.slice(0, -1));
    } else {
      setCode((c) => (c.length >= 3 ? c : c + k));
    }
  }

  function handleEnter() {
    if (checkedOut || !code) return;
    submitCode(code);
  }

  function handleCheckout() {
    if (cart.length === 0) return;
    trackEvent("showcase_pos_checkout", { items: cart.length });
    setCheckedOut(true);
    clearTimeout(checkoutTimer.current);
    checkoutTimer.current = setTimeout(() => {
      setCheckedOut(false);
      setCart([]);
    }, 1600);
  }

  const total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const activeProduct = CATALOG[code];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
      <div>
        <div className="text-center mb-4">
          <p className="text-accent font-extrabold text-base tracking-wide">
            INGRESÁ EL CÓDIGO DE PRODUCTO
          </p>
          <p className="text-on-surface-variant text-sm mt-1">
            Usá el teclado o tocá uno de los códigos rápidos
          </p>
        </div>

        <div className="bg-black border-4 border-amber-500 rounded-lg px-6 py-8 text-center">
          {notFound ? (
            <p
              className="font-mono font-extrabold tracking-wide text-5xl sm:text-6xl mb-2 text-red-500"
              style={{ textShadow: "0 0 12px rgba(248,113,113,.6), 0 0 2px rgba(248,113,113,.9)" }}
            >
              ERROR
            </p>
          ) : (
            <p className="led-display text-5xl sm:text-6xl mb-2">{code || "•••"}</p>
          )}
          <p className="text-gray-300 text-sm sm:text-base min-h-[24px]">
            {notFound
              ? "Código no encontrado"
              : activeProduct
              ? activeProduct.name
              : "Ingresá 3 dígitos y presioná Enter"}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {QUICK_CODES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCode(c);
                submitCode(c);
              }}
              disabled={checkedOut}
              className="font-mono text-xs font-bold px-2.5 py-1.5 rounded-md bg-surface-container-high border border-border text-on-surface-variant hover:text-on-surface hover:border-primary-light transition-colors disabled:opacity-40"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {KEYS.map((k) => (
            <button
              key={k}
              onClick={() => pressKey(k)}
              disabled={checkedOut}
              className="bg-surface-container-high hover:bg-surface-container-highest border border-border rounded-lg py-3 text-on-surface font-bold text-lg transition-colors active:scale-95 disabled:opacity-40"
            >
              {k}
            </button>
          ))}
        </div>
        <button
          onClick={handleEnter}
          disabled={checkedOut || !code}
          className="btn-primary w-full mt-2 py-3 rounded-lg font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Agregar — ENTER
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex-1 flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-0.5">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center text-on-surface-variant/60 text-sm border border-dashed border-border rounded-lg py-10 px-4">
              El carrito está vacío.
              <br />
              Probá con el código 247, 012 o 156.
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={item.code} className="bg-surface-container-high border border-border rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-primary-light text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-teal font-extrabold text-base">{formatARS(item.price * item.qty)}</span>
                </div>
                <p className="text-on-surface text-sm mb-1">{item.name}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Cantidad: {item.qty}</span>
                  <span className="text-on-surface-variant/70">{formatARS(item.price)} c/u</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-black border-2 border-amber-500 rounded-lg p-3 text-center">
          <p className="text-gray-300 text-xs">TOTAL</p>
          <p className="led-display text-2xl">{formatARS(total)}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {cart.length} producto{cart.length === 1 ? "" : "s"}
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || checkedOut}
          className={`font-extrabold py-3.5 rounded-lg text-sm transition-colors ${
            checkedOut
              ? "bg-teal text-surface"
              : "bg-green-600 hover:bg-green-500 border-2 border-green-400 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {checkedOut ? (
            <span className="inline-flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Venta registrada
            </span>
          ) : (
            "FINALIZAR VENTA — ENTER"
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────── */

const DAY_BARS = [
  { day: "Lun", value: 34000, tone: "var(--chart-sales)" },
  { day: "Mar", value: 28000, tone: "var(--chart-sales)" },
  { day: "Mié", value: 45000, tone: "var(--chart-sales)" },
  { day: "Jue", value: 32000, tone: "var(--chart-sales)" },
  { day: "Vie", value: 56000, tone: "var(--color-accent)" },
  { day: "Sáb", value: 64000, tone: "var(--color-accent)" },
  { day: "Dom", value: 26000, tone: "var(--chart-sales)" },
];
const DAY_MAX = Math.max(...DAY_BARS.map((b) => b.value));

const CATEGORY_MARGINS = [
  { label: "Bebidas", pct: 41, tone: "text-teal", bar: "bg-teal" },
  { label: "Limpieza", pct: 37, tone: "text-teal", bar: "bg-teal" },
  { label: "Almacén", pct: 24, tone: "text-amber-400", bar: "bg-amber-400" },
  { label: "Fiambres", pct: 17, tone: "text-red-400", bar: "bg-red-400" },
];

function DashboardPanel() {
  const stats = [
    { label: "Total Ventas", value: "$248.900", delta: "↑ 12,4%", up: true, icon: Wallet },
    { label: "Transacciones", value: "64", delta: "↑ 8,0%", up: true, icon: ShoppingCart },
    { label: "Ganancias", value: "$95.100", delta: "↑ 9,7%", up: true, icon: TrendingUp },
    { label: "% Margen", value: "38,2%", delta: "↑ 3,1%", up: true, icon: TrendingUp },
    { label: "Venta Neta", value: "$231.700", delta: "↓ 1,2%", up: false, icon: Wallet },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container-high/60 border border-border rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-on-surface-variant/70 text-[11px] font-semibold">{s.label}</span>
              <s.icon className="w-3.5 h-3.5 text-primary-light" />
            </div>
            <p className="text-on-surface font-extrabold text-base font-mono">{s.value}</p>
            <p className={`text-[11px] font-bold ${s.up ? "text-teal" : "text-red-400"}`}>{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="bento-card rounded-2xl p-5">
          <p className="text-on-surface font-bold text-sm mb-5">
            Ventas por día — últimos 7 días{" "}
            <span className="text-on-surface-variant/50 font-normal text-xs">(pasá el mouse por una barra)</span>
          </p>
          <div className="flex items-end gap-3 h-[130px]">
            {DAY_BARS.map((b) => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  title={formatARS(b.value)}
                  className="w-full rounded-t-md transition-transform group-hover:scale-x-110 cursor-default relative"
                  style={{ height: `${(b.value / DAY_MAX) * 100}%`, background: b.tone }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-on-surface bg-surface-container border border-border rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatARS(b.value)}
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant/60 font-mono">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card rounded-2xl p-5">
          <p className="text-on-surface font-bold text-sm mb-4">Top rubros por margen</p>
          <div className="flex flex-col gap-3.5">
            {CATEGORY_MARGINS.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-on-surface-variant">{c.label}</span>
                  <span className={`font-bold ${c.tone}`}>{c.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-container-high">
                  <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${c.pct * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin — tabla con acciones reales ─────────────────────── */

type Product = {
  code: string;
  name: string;
  rubro: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
};

const INITIAL_PRODUCTS: Product[] = [
  { code: "012", name: "Coca-Cola 500ml", rubro: "Bebidas", cost: 820, price: 1200, stock: 48, minStock: 10 },
  { code: "247", name: "Harina 000 1kg", rubro: "Almacén", cost: 690, price: 840, stock: 3, minStock: 10 },
  { code: "089", name: "Detergente Magistral 500ml", rubro: "Limpieza", cost: 1150, price: 1950, stock: 27, minStock: 10 },
  { code: "156", name: "Yerba Playadito 1kg", rubro: "Almacén", cost: 1560, price: 2100, stock: 31, minStock: 10 },
];

const MENU_ACTIONS = [
  { id: "edit", icon: Pencil, label: "Editar", tone: "text-on-surface" },
  { id: "label", icon: Tag, label: "Imprimir etiqueta", tone: "text-primary-light" },
  { id: "stock", icon: Package, label: "Ajustar stock (+10)", tone: "text-teal" },
  { id: "delete", icon: Trash2, label: "Eliminar", tone: "text-red-400" },
] as const;

function AdminPanel() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [newSeq, setNewSeq] = useState(1);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function flashToast(msg: string) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1700);
  }

  function handleAdd() {
    const code = String(900 + newSeq).padStart(3, "0");
    setNewSeq((n) => n + 1);
    setProducts((prev) => [
      { code, name: "Producto nuevo", rubro: "Sin categoría", cost: 0, price: 0, stock: 0, minStock: 5 },
      ...prev,
    ]);
    flashToast("Producto agregado — editalo desde el menú ⋮");
    trackEvent("showcase_admin_add");
  }

  function handleAction(code: string, action: (typeof MENU_ACTIONS)[number]["id"]) {
    setOpenMenu(null);
    if (action === "delete") {
      setProducts((prev) => prev.filter((p) => p.code !== code));
      flashToast("Producto eliminado");
    } else if (action === "stock") {
      setProducts((prev) => prev.map((p) => (p.code === code ? { ...p, stock: p.stock + 10 } : p)));
      flashToast("+10 unidades cargadas");
    } else if (action === "edit") {
      flashToast("El editor completo está disponible en la app");
    } else if (action === "label") {
      flashToast("Etiqueta enviada a la impresora ✓");
    }
    trackEvent("showcase_admin_action", { action });
  }

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="relative">
      {openMenu && <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex flex-wrap gap-2">
          <span className="eyebrow-chip text-primary-light bg-blue-500/10 border-blue-500/25 normal-case tracking-normal font-bold">
            Todos · {products.length}
          </span>
          <span className="eyebrow-chip text-amber-400 bg-amber-500/10 border-amber-500/25 normal-case tracking-normal font-bold">
            Stock bajo · {lowStock}
          </span>
          <span className="eyebrow-chip text-red-400 bg-red-500/10 border-red-500/25 normal-case tracking-normal font-bold">
            Sin stock · {outOfStock}
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary inline-flex items-center whitespace-nowrap text-xs px-4 py-2.5 rounded-lg hover:scale-105 active:scale-95 transition-transform"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="relative rounded-xl border border-border">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_0.4fr] sm:grid-cols-[2.2fr_1fr_1fr_1fr_0.5fr] gap-0 bg-surface-container-high/70 rounded-t-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">
          <span>Producto</span>
          <span className="hidden sm:block">Costo</span>
          <span>Precio</span>
          <span>Stock</span>
          <span />
        </div>

        {products.length === 0 && (
          <div className="px-4 py-8 text-center text-on-surface-variant/60 text-sm rounded-b-xl border-t border-border">
            No quedan productos. Probá agregar uno nuevo.
          </div>
        )}

        {products.map((p, i) => {
          const warn = p.stock <= p.minStock;
          const menuOpen = openMenu === p.code;
          return (
            <div
              key={p.code}
              className={`relative grid grid-cols-[1.6fr_1fr_1fr_0.4fr] sm:grid-cols-[2.2fr_1fr_1fr_1fr_0.5fr] gap-0 items-center px-4 py-3.5 border-t border-border ${
                i === products.length - 1 ? "rounded-b-xl" : ""
              } ${warn ? "bg-red-500/[0.06]" : menuOpen ? "bg-accent/[0.06]" : ""}`}
            >
              <div>
                <p className="text-on-surface text-sm font-semibold">{p.name}</p>
                <p className="text-on-surface-variant/60 text-xs">
                  Cód. {p.code} · {p.rubro}
                </p>
              </div>
              <span className="hidden sm:block text-on-surface-variant text-sm">{formatARS(p.cost)}</span>
              <span className="text-on-surface text-sm font-semibold">{formatARS(p.price)}</span>
              <div>
                <span className={`text-sm font-semibold ${warn ? "text-red-400" : "text-on-surface"}`}>
                  {p.stock} u.
                </span>
                {warn && <p className="text-red-400 text-xs">Mín: {p.minStock}</p>}
              </div>
              <div className="relative text-right z-10">
                <button
                  onClick={() => setOpenMenu(menuOpen ? null : p.code)}
                  aria-label="Acciones del producto"
                  aria-expanded={menuOpen}
                  className="p-1 -m-1 rounded-md hover:bg-surface-container-highest transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-on-surface-variant/60 ml-auto" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 w-56 bg-surface-container border border-border rounded-lg shadow-xl py-1.5 text-left z-20">
                    {MENU_ACTIONS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAction(p.code, item.id)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-surface-container-high transition-colors ${item.tone}`}
                      >
                        <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 translate-y-full z-30 bg-surface-container border border-border rounded-full px-4 py-2.5 shadow-xl text-on-surface text-sm flex items-center gap-2 whitespace-nowrap">
          <Check className="w-4 h-4 text-teal flex-shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ─── Sección ─────────────────────────────────────────────────── */

export default function Showcase() {
  const [tab, setTab] = useState<TabId>("pos");

  function selectTab(id: TabId) {
    setTab(id);
    trackEvent("showcase_tab_view", { tab: id });
  }

  return (
    <section id="showcase" className="relative bg-surface-container-lowest py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full ambient-blob-blue" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="eyebrow-chip text-primary-light bg-blue-500/10 border-blue-500/25">
            Mirá Omero por dentro
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface mb-4 mt-5">
            Los mismos componentes que vas a usar todos los días
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            No son capturas de marketing. Jugá con la interfaz real: el POS del cajero, el
            dashboard del dueño y el panel de administración.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-7">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  active
                    ? "btn-primary"
                    : "bg-surface-container-high border-border text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="bento-card rounded-2xl p-5 sm:p-7 overflow-visible">
          {tab === "pos" && <PosPanel />}
          {tab === "dashboard" && <DashboardPanel />}
          {tab === "admin" && <AdminPanel />}
        </div>
      </div>
    </section>
  );
}
