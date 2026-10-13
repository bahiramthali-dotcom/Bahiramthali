"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { wa } from "@/lib/client";

const tabs = [["/", "⌂", "Home"], ["/menu", "🍴", "Menu"], ["/bookings", "🗓", "Bookings"], ["/account", "👤", "Account"]];

export default function Shell({ children, nav = true, fab = true }) {
  const p = usePathname();
  return (
    <div className="app">
      {children}
      {fab && (
        <a className="fab" href={wa("Hi Bahiram Thali! I'd like to book / order.")} target="_blank" aria-label="WhatsApp">💬</a>
      )}
      {nav && (
        <nav className="nav">
          {tabs.map(([href, icon, label]) => (
            <Link key={href} href={href} className={p === href ? "on" : ""}>
              <span>{icon}</span>{label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export function Top({ kicker, title, sub }) {
  return (
    <div className="top">
      <Link href="/" className="back">←</Link>
      <div>
        {kicker && <small>{kicker}</small>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

export function Counter({ label, value, set, min = 1, max = 99 }) {
  return (
    <div className="counter">
      <div><small style={{ color: "var(--muted)", fontSize: 11, fontWeight: 800 }}>{label}</small><div><b>{value}</b></div></div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => set(Math.max(min, value - 1))}>−</button>
        <button onClick={() => set(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}
