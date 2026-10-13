"use client";
import { useEffect, useState } from "react";

export const PHONE = "918956922916";
export const wa = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export function useApi(path, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    fetch(path).then((r) => (r.ok ? r.json() : fallback)).then(setData).catch(() => {});
  }, [path]);
  return [data, setData];
}

export function nextDays(n = 14) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({
      iso: d.toLocaleDateString("en-CA"),
      day: i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    });
  }
  return out;
}

export const hourLabel = (h) => `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`;

export function describe(b) {
  if (b.type === "table") return [`🍴 Table · ${b.guests} guests`, `${b.date} · ${hourLabel(b.hour)}`];
  if (b.type === "studio") return [`🪷 Studio · ${b.kind}`, `${b.date} · ${b.shift} · ${b.people} people`];
  if (b.type === "party") return [`🎉 Party · ${b.servings} servings`, `${b.date} · ${b.delivery ? "Delivery" : "Pickup"}`];
  return [`🛵 Order · ${b.mode}`, (b.items || []).map((i) => `${i.q}× ${i.name}`).join(", ")];
}

export function localBookings() {
  try { return JSON.parse(localStorage.getItem("bk_bookings") || "[]"); } catch { return []; }
}

// Saves to the server (for the owner panel) and on this device, then opens WhatsApp.
export async function submitBooking(booking, message) {
  let saved = { ...booking, created: new Date().toISOString(), status: "pending" };
  try {
    const r = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(booking) });
    if (r.ok) saved = await r.json();
  } catch {}
  try { localStorage.setItem("bk_bookings", JSON.stringify([saved, ...localBookings()])); } catch {}
  window.open(wa(message), "_blank");
  return saved;
}
