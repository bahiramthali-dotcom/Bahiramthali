"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { localBookings, describe, inr } from "@/lib/client";

export default function Bookings() {
  const [list, setList] = useState([]);
  useEffect(() => setList(localBookings()), []);
  return (
    <Shell>
      <div className="top"><div><h1>My bookings</h1><p>Saved on this device · tables & studio, one place</p></div></div>
      <div className="pad" style={{ paddingTop: 0 }}>
        {list.map((b, i) => {
          const [t, sub] = describe(b);
          return (
            <div key={b.id || i} className="item">
              <div style={{ display: "flex", justifyContent: "space-between" }}><b>{t}</b><span className="status">{b.status || "sent"}</span></div>
              <div style={{ color: "var(--muted)" }}>{sub}</div>
              {b.amount ? <b>{inr(b.amount)}</b> : null}
            </div>
          );
        })}
        <p className="note">Bookings appear here after you send them to us on WhatsApp. Our team confirms each one on WhatsApp. Pay at the venue.</p>
      </div>
    </Shell>
  );
}
