"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { describe, inr, wa } from "@/lib/client";

const CATS = ["Thalis", "Handi", "Starters", "Seafood", "Mains", "Veg Mains", "Breads", "Rice", "Extras"];
const blank = { cat: "Thalis", name: "", desc: "", price: 0, veg: false, img: "", flags: "", show: true };

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [menu, setMenu] = useState([]);
  const [settings, setSettings] = useState({});
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch("/api/bookings");
    if (!r.ok) return setAuthed(false);
    setBookings(await r.json());
    setMenu(await (await fetch("/api/menu")).json());
    setSettings(await (await fetch("/api/settings")).json());
    setAuthed(true);
  }
  useEffect(() => { load(); }, []);

  async function login(e) {
    e.preventDefault();
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) load(); else setErr("Wrong password");
  }
  async function put(path, body) {
    const r = await fetch(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setMsg(r.ok ? "Saved ✓" : "Save failed"); setTimeout(() => setMsg(""), 2000);
  }
  async function setStatus(id, status) {
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setBookings((l) => (status === "deleted" ? l.filter((b) => b.id !== id) : l.map((b) => (b.id === id ? { ...b, status } : b))));
  }
  function saveDish() {
    const next = [...menu];
    if (editing.i == null) next.push(editing.d); else next[editing.i] = editing.d;
    setMenu(next); put("/api/menu", next); setEditing(null);
  }
  function deleteDish() {
    const next = menu.filter((_, i) => i !== editing.i);
    setMenu(next); put("/api/menu", next); setEditing(null);
  }
  const toggleShow = (i) => { const next = menu.map((d, j) => (j === i ? { ...d, show: d.show === false } : d)); setMenu(next); put("/api/menu", next); };

  if (authed === null) return <div className="admin">Loading…</div>;
  if (!authed)
    return (
      <form className="admin" style={{ maxWidth: 380 }} onSubmit={login}>
        <h1>🔑 Owner panel</h1>
        <input type="password" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        {err && <p style={{ color: "var(--accent)" }}>{err}</p>}
        <button className="btn">Sign in</button>
        <Link href="/" className="btn ghost">← Back to site</Link>
      </form>
    );

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const nums = (v) => v.split(",").map((x) => parseInt(x)).filter((x) => !isNaN(x));
  const stats = {
    pending: bookings.filter((b) => b.status === "pending").length,
    today: bookings.filter((b) => b.date === new Date().toLocaleDateString("en-CA")).length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((a, b) => a + (b.amount || 0), 0),
  };

  return (
    <div className="admin">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div><h1 style={{ margin: 0 }}>Owner panel</h1><p className="note" style={{ margin: 0 }}>Bookings, dishes, rates, offers & closed days</p></div>
        <div>{msg && <b style={{ color: "var(--green)", marginRight: 8 }}>{msg}</b>}
          <Link className="mini" href="/menu">View app menu</Link>
          <button className="mini" onClick={async () => { await fetch("/api/login", { method: "DELETE" }); setAuthed(false); }}>Sign out</button>
        </div>
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        <div className="item"><small>Pending</small><h2 style={{ margin: 0 }}>{stats.pending}</h2></div>
        <div className="item"><small>For today</small><h2 style={{ margin: 0 }}>{stats.today}</h2></div>
        <div className="item"><small>Confirmed value</small><h2 style={{ margin: 0 }}>{inr(stats.revenue)}</h2></div>
      </div>
      <div className="tabs">
        {[["bookings", "Bookings & orders"], ["dishes", "Order Online · Dishes"], ["settings", "Rates & offers"]].map(([k, l]) => (
          <button key={k} className={"pill" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "bookings" && (
        <div className="tablewrap"><table>
          <thead><tr><th>Received</th><th>What</th><th>Customer</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {bookings.map((b) => { const [t, s] = describe(b); return (
              <tr key={b.id}>
                <td>{new Date(b.created).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</td>
                <td><b>{t}</b><br /><span style={{ color: "var(--muted)" }}>{s}</span>{b.address && <><br />📍 {b.address}</>}</td>
                <td>{b.name || "—"}{b.phone && <><br /><a href={`https://wa.me/91${b.phone.replace(/\D/g, "").slice(-10)}`} target="_blank">{b.phone}</a></>}</td>
                <td>{inr(b.amount)}</td>
                <td><span className={"status " + b.status}>{b.status}</span></td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="mini" onClick={() => setStatus(b.id, "confirmed")}>✓ Confirm</button>
                  <button className="mini" onClick={() => setStatus(b.id, "cancelled")}>✕ Cancel</button>
                  <button className="mini" onClick={() => confirm("Delete this booking?") && setStatus(b.id, "deleted")}>🗑</button>
                </td>
              </tr>
            ); })}
            {!bookings.length && <tr><td colSpan={6} className="note">No bookings yet. They appear here when customers send them.</td></tr>}
          </tbody>
        </table></div>
      )}

      {tab === "dishes" && (
        <>
          <p className="note">Choose which dishes customers can order, change prices and add new dishes.</p>
          <button className="mini" onClick={() => setEditing({ i: null, d: { ...blank } })}>+ Add dish</button>
          <div className="tablewrap"><table>
            <thead><tr><th>Show</th><th>Dish</th><th>Category</th><th>Price</th><th></th></tr></thead>
            <tbody>
              {menu.map((d, i) => (
                <tr key={i} style={{ opacity: d.show === false ? 0.45 : 1 }}>
                  <td><input type="checkbox" style={{ width: "auto" }} checked={d.show !== false} onChange={() => toggleShow(i)} /></td>
                  <td><span className={"vb " + (d.veg ? "veg" : "nv")} />{d.name}{d.flags?.includes("s") && <span className="badge">SIG</span>}{d.flags?.includes("h") && <span className="badge">🌶</span>}</td>
                  <td>{d.cat}</td><td>{inr(d.price)}</td>
                  <td><button className="mini" onClick={() => setEditing({ i, d: { ...d } })}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </>
      )}

      {tab === "settings" && (
        <>
          <div className="fields">
            <label>Offer banner<input value={settings.offerBanner || ""} onChange={(e) => set("offerBanner", e.target.value)} /></label>
            <label>Table reservation fee (₹)<input type="number" value={settings.tableFee ?? ""} onChange={(e) => set("tableFee", +e.target.value)} /></label>
            <label>Studio rate per shift (₹)<input type="number" value={settings.studioRate ?? ""} onChange={(e) => set("studioRate", +e.target.value)} /></label>
            <label>Studio advance (₹)<input type="number" value={settings.studioAdvance ?? ""} onChange={(e) => set("studioAdvance", +e.target.value)} /></label>
            <label>Party delivery fee (₹)<input type="number" value={settings.partyDelivery ?? ""} onChange={(e) => set("partyDelivery", +e.target.value)} /></label>
            <label>Free delivery above (₹)<input type="number" value={settings.freeDeliveryAbove ?? ""} onChange={(e) => set("freeDeliveryAbove", +e.target.value)} /></label>
            <label>Lunch hours (24h, comma separated)<input defaultValue={(settings.lunchHours || []).join(", ")} onBlur={(e) => set("lunchHours", nums(e.target.value))} /></label>
            <label>Dinner hours (24h, comma separated)<input defaultValue={(settings.dinnerHours || []).join(", ")} onBlur={(e) => set("dinnerHours", nums(e.target.value))} /></label>
            <label>Flame offers (hour:% e.g. 15:50, 22:50)<input defaultValue={Object.entries(settings.flameHours || {}).map(([h, p]) => `${h}:${p}`).join(", ")}
              onBlur={(e) => set("flameHours", Object.fromEntries(e.target.value.split(",").map((x) => x.split(":").map((y) => parseInt(y))).filter(([h, p]) => !isNaN(h) && !isNaN(p))))} /></label>
            <label>Studio shifts (comma separated)<input defaultValue={(settings.studioShifts || []).join(", ")} onBlur={(e) => set("studioShifts", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></label>
          </div>
          <div className="step">Closed days</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {(settings.closedDays || []).map((d) => <button key={d} className="mini" onClick={() => set("closedDays", settings.closedDays.filter((x) => x !== d))}>{d} ✕</button>)}
            <input type="date" style={{ width: 180, margin: 0 }} onChange={(e) => e.target.value && set("closedDays", [...new Set([...(settings.closedDays || []), e.target.value])].sort())} />
          </div>
          <button className="btn" style={{ maxWidth: 240 }} onClick={() => put("/api/settings", settings)}>Save settings</button>
        </>
      )}

      {editing && (
        <div className="sheet" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div>
            <h3 style={{ marginTop: 0 }}>{editing.i == null ? "Add dish" : "Edit dish"}</h3>
            {(() => { const d = editing.d; const up = (k, v) => setEditing({ ...editing, d: { ...d, [k]: v } }); return (
              <>
                <input placeholder="Dish name" value={d.name} onChange={(e) => up("name", e.target.value)} />
                <select value={d.cat} onChange={(e) => up("cat", e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
                <input type="number" placeholder="Price (₹)" value={d.price} onChange={(e) => up("price", +e.target.value)} />
                <textarea rows={2} placeholder="Description" value={d.desc} onChange={(e) => up("desc", e.target.value)} />
                <select value={d.veg ? "veg" : "nv"} onChange={(e) => up("veg", e.target.value === "veg")}><option value="nv">Non-veg</option><option value="veg">Veg</option></select>
                <select value={d.flags} onChange={(e) => up("flags", e.target.value)}><option value="">No label</option><option value="s">Signature</option><option value="h">Spicy</option><option value="sh">Signature + Spicy</option></select>
                <input placeholder="Photo file in /public/img (e.g. bk-lapeta.jpg)" value={d.img} onChange={(e) => up("img", e.target.value)} />
                <button className="btn" disabled={!d.name} onClick={saveDish}>Done</button>
                {editing.i != null && <button className="btn ghost" onClick={deleteDish}>Delete dish</button>}
                <button className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
              </>
            ); })()}
          </div>
        </div>
      )}
    </div>
  );
}
