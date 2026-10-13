"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";

export default function Account() {
  const [name, setName] = useState("Guest");
  const [edit, setEdit] = useState(false);
  useEffect(() => { try { setName(localStorage.getItem("bk_name") || "Guest"); } catch {} }, []);
  const save = () => { try { localStorage.setItem("bk_name", name); } catch {} setEdit(false); };
  const rows = [["/bookings", "🗓", "My bookings", "Tables & studio shifts"], ["/menu", "🍴", "Menu", "Thalis, handi & more"], ["/admin", "🔑", "Owner panel", "Bookings, rates, offers & closed days"]];
  return (
    <Shell>
      <div className="top"><h1>Account</h1></div>
      <div className="pad" style={{ paddingTop: 0 }}>
        <div className="item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {edit ? <input style={{ margin: 0, marginRight: 8 }} value={name} onChange={(e) => setName(e.target.value)} /> : <b style={{ fontSize: 16 }}>👤 {name}</b>}
          <button className="mini" onClick={() => (edit ? save() : setEdit(true))}>{edit ? "Save" : "Edit"}</button>
        </div>
        {rows.map(([href, i, t, s]) => (
          <Link key={href} href={href} className="item" style={{ display: "block" }}>{i} <b>{t}</b><div style={{ color: "var(--muted)", fontSize: 12 }}>{s}</div></Link>
        ))}
        <button className="btn ghost" onClick={() => { try { localStorage.clear(); } catch {} setName("Guest"); }}>Sign out</button>
      </div>
    </Shell>
  );
}
