"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell, { Top } from "@/components/Shell";
import Dish from "@/components/Dish";
import { useApi, inr, submitBooking } from "@/lib/client";

const MIN = 20;

export default function Party() {
  const [menu] = useApi("/api/menu", []);
  const [s] = useApi("/api/settings", {});
  const router = useRouter();
  const [cart, setCart] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [addr, setAddr] = useState("");

  // Handis feed ~4 people, thali packs 1 — breads & rice are sides.
  const items = menu.filter((d) => d.show !== false && (d.cat === "Handi" || d.cat === "Thalis" || d.cat === "Breads" || d.cat === "Rice"));
  const serves = (d) => (d.cat === "Handi" ? (d.name.includes("Full") ? 6 : 3) : d.cat === "Thalis" ? 1 : 0);
  const lines = items.filter((d) => cart[d.name]);
  const servings = lines.reduce((a, d) => a + serves(d) * cart[d.name], 0);
  const fee = delivery ? s.partyDelivery ?? 500 : 0;
  const total = lines.reduce((a, d) => a + d.price * cart[d.name], 0) + fee;
  const bump = (n, by) => setCart((c) => ({ ...c, [n]: Math.max(0, (c[n] || 0) + by) }));
  const ok = servings >= MIN && name && phone && date;

  async function go() {
    const msg = `Hi Bahiram Thali! Party order for ${date}:\n` + lines.map((d) => `${cart[d.name]} × ${d.name}`).join("\n") +
      `\n~${servings} servings · ${delivery ? `Pune delivery (${inr(fee)})\nAddress: ${addr}` : "Pickup"}\nEst. ${inr(total)} + GST 5%\nName: ${name} · ${phone}`;
    await submitBooking({ type: "party", date, name, phone, delivery, address: addr, servings, items: lines.map((d) => ({ name: d.name, q: cart[d.name], price: d.price })), amount: total }, msg);
    router.push("/bookings");
  }

  return (
    <Shell nav={false}>
      <Top title="🎉 Bahiram Party Orders" sub="Feed 20+ people, the Varhadi way." />
      <div className="pad" style={{ paddingTop: 0 }}>
        <div className="grid" style={{ fontSize: 11, fontWeight: 700 }}>
          {["1 Pick handis & packs", "2 Pickup or ₹500 delivery", "3 We call to confirm"].map((t) => <div key={t} className="item" style={{ margin: 0 }}>{t}</div>)}
        </div>
        <p className="note">Minimum {MIN} servings · delivery anywhere in Pune · order at least 24 hours ahead</p>
        {items.map((d) => <Dish key={d.name} d={d} qty={cart[d.name]} onAdd={() => bump(d.name, 1)} onSub={() => bump(d.name, -1)} />)}
        <div className="step">Your details</div>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="date" value={date} min={new Date(Date.now() + 864e5).toLocaleDateString("en-CA")} onChange={(e) => setDate(e.target.value)} />
        <div className="grid2">
          <button className={"pill" + (!delivery ? " on" : "")} onClick={() => setDelivery(false)}>Pickup · free</button>
          <button className={"pill" + (delivery ? " on" : "")} onClick={() => setDelivery(true)}>Pune delivery · {inr(s.partyDelivery ?? 500)}</button>
        </div>
        {delivery && <textarea style={{ marginTop: 10 }} rows={2} placeholder="Delivery address" value={addr} onChange={(e) => setAddr(e.target.value)} />}
        <p className="note">Servings count handis & thali packs (bhakri and rice are sides). GST 5% extra · final quote confirmed on call.</p>
      </div>
      <div className="bar">
        <div><small>{servings} / {MIN} servings · {inr(total)}</small><b>{servings < MIN ? "Add handis or thali packs" : ok ? "Ready to send" : "Fill in your details"}</b></div>
        <button disabled={!ok} onClick={go}>CONTINUE</button>
      </div>
    </Shell>
  );
}
