"use client";
import { useMemo, useState } from "react";
import Shell from "@/components/Shell";
import Dish from "@/components/Dish";
import { useApi, inr, submitBooking } from "@/lib/client";

const modes = ["Delivery", "Pickup", "Dine-in pre-order"];

export default function Menu() {
  const [menu] = useApi("/api/menu", []);
  const [s] = useApi("/api/settings", {});
  const [cart, setCart] = useState({});
  const [cat, setCat] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(modes[0]);
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");

  const shown = menu.filter((d) => d.show !== false);
  const cats = ["All", ...new Set(shown.map((d) => d.cat))];
  const list = shown.filter((d) => (cat === "All" || d.cat === cat) && (!vegOnly || d.veg));
  const lines = useMemo(() => shown.filter((d) => cart[d.name]).map((d) => ({ ...d, q: cart[d.name] })), [cart, menu]);
  const count = lines.reduce((a, l) => a + l.q, 0);
  const sub = lines.reduce((a, l) => a + l.q * l.price, 0);
  const free = s.freeDeliveryAbove ?? 999;
  const discount = mode === "Dine-in pre-order" ? Math.round(sub * 0.2) : 0;
  const total = sub - discount;
  const bump = (n, by) => setCart((c) => ({ ...c, [n]: Math.max(0, (c[n] || 0) + by) }));

  async function send() {
    const msg = `Hi Bahiram Thali! Order (${mode}):\n` + lines.map((l) => `${l.q} × ${l.name} — ${inr(l.q * l.price)}`).join("\n") +
      `\nSubtotal ${inr(sub)}${discount ? `\nDine-in 20% off −${inr(discount)}` : ""}\nTotal ${inr(total)} + GST 5%` +
      (name ? `\nName: ${name}` : "") + (mode === "Delivery" && addr ? `\nAddress: ${addr}` : "");
    await submitBooking({ type: "order", mode, name, address: addr, items: lines.map((l) => ({ name: l.name, q: l.q, price: l.price })), amount: total }, msg);
    setCart({}); setOpen(false);
  }

  return (
    <Shell fab={false}>
      <div className="top" style={{ alignItems: "flex-start" }}>
        <img src="/img/bk-logo-icon.jpg" alt="" style={{ width: 48, borderRadius: 12 }} />
        <div><small style={{ color: "var(--muted)", fontSize: 11, fontWeight: 700 }}>A VARHADI EXPERIENCE · WAKAD</small><h1 style={{ margin: "2px 0", fontSize: 22 }}>Menu & Order</h1><p style={{ margin: 0, color: "var(--muted)", fontSize: 12 }}>Slow-cooked in clay handis, the Varhadi way.</p></div>
      </div>
      <div className="pad" style={{ paddingTop: 0 }}>
        <div className="offer">🛵 <span>Free delivery above {inr(free)} · Wakad & nearby (within ~10 km) · <b>20% off dine-in pre-orders</b></span></div>
        <p className="note" style={{ marginTop: 8 }}>GST 5% extra · all preparations take 15–20 min · pay on delivery or UPI at the counter</p>
      </div>
      <div className="cats">
        <div className="scroll">
          <button className={"pill" + (vegOnly ? " on" : "")} onClick={() => setVegOnly(!vegOnly)}><span className="vb veg" />Veg</button>
          {cats.map((c) => <button key={c} className={"pill" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>
      <div className="pad">
        {list.map((d) => <Dish key={d.name} d={d} qty={cart[d.name]} onAdd={() => bump(d.name, 1)} onSub={() => bump(d.name, -1)} />)}
        {!menu.length && <p className="note">Loading menu…</p>}
      </div>
      {count > 0 && (
        <div className="bar" style={{ bottom: 84 }}>
          <div><small>{count} items · {inr(sub)}</small><b>{sub >= free ? "Free delivery unlocked" : `Free delivery above ${inr(free)}`}</b></div>
          <button onClick={() => setOpen(true)}>ORDER</button>
        </div>
      )}
      {open && (
        <div className="sheet" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div>
            <h3 style={{ marginTop: 0 }}>Your order</h3>
            {lines.map((l) => (
              <div key={l.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span>{l.q} × {l.name}</span><b>{inr(l.q * l.price)}</b>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 8 }}><span>Subtotal</span><b>{inr(sub)}</b></div>
            {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "var(--green)" }}><span>Dine-in 20% off</span><b>−{inr(discount)}</b></div>}
            <div className="scroll" style={{ margin: "12px 0" }}>{modes.map((m) => <button key={m} className={"pill" + (mode === m ? " on" : "")} onClick={() => setMode(m)}>{m}</button>)}</div>
            <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            {mode === "Delivery" && <textarea rows={2} placeholder="Delivery address" value={addr} onChange={(e) => setAddr(e.target.value)} />}
            <button className="btn" onClick={send}>Send order on WhatsApp · {inr(total)}</button>
            <button className="btn ghost" onClick={() => setOpen(false)}>Keep browsing</button>
          </div>
        </div>
      )}
    </Shell>
  );
}
