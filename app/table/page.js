"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell, { Top, Counter } from "@/components/Shell";
import { useApi, nextDays, hourLabel, submitBooking, inr } from "@/lib/client";

export default function Table() {
  const [s] = useApi("/api/settings", {});
  const router = useRouter();
  const days = nextDays();
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const closed = s.closedDays || [];
  const hours = [...(s.lunchHours || []), ...(s.dinnerHours || [])];
  const flame = s.flameHours || {};
  const fee = s.tableFee ?? 49;
  const now = new Date();

  async function go() {
    const d = days.find((x) => x.iso === date);
    const msg = `Hi Bahiram Thali! Table booking:\n${d.day} ${d.date}, ${hourLabel(hour)}\n${guests} guests${name ? `\nName: ${name}` : ""}\nReservation ${inr(fee)}`;
    await submitBooking({ type: "table", date, hour, guests, name, amount: fee }, msg);
    router.push("/bookings");
  }

  return (
    <Shell nav={false}>
      <Top kicker="Bahiram Thali · Wakad" title="Book a Table" sub="Slow-cooked Varhadi thalis · lunch & dinner, by the hour" />
      <div className="pad" style={{ paddingTop: 0 }}>
        <div className="step">1 · Pick a date</div>
        <div className="scroll">
          {days.map((d) => (
            <button key={d.iso} className={"pill" + (date === d.iso ? " on" : "")} disabled={closed.includes(d.iso)} onClick={() => { setDate(d.iso); setHour(null); }}>
              <div style={{ fontSize: 11 }}>{d.day}</div>{d.date}
            </button>
          ))}
        </div>
        <div className="step">2 · Pick an hour</div>
        <div className="grid">
          {hours.map((h) => {
            const past = date === days[0].iso && h <= now.getHours();
            return (
              <button key={h} className={"pill" + (hour === h ? " on" : "")} disabled={!date || past} onClick={() => setHour(h)}>
                {hourLabel(h)}{flame[h] && <span className="flame">🔥 {flame[h]}%</span>}
              </button>
            );
          })}
        </div>
        <div className="step">3 · Guests</div>
        <Counter label="GUESTS" value={guests} set={setGuests} max={30} />
        <input style={{ marginTop: 12 }} placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="note">🔥 Flame-badge hours get up to 50% off. Your table is confirmed by our team on WhatsApp · pay at the counter or by UPI.</p>
      </div>
      <div className="bar">
        <div><small>{date && hour != null ? `${hourLabel(hour)} · ${guests} guests` : "Pick a slot above"}</small><b>Reserve for just {inr(fee)}</b></div>
        <button disabled={!date || hour == null} onClick={go}>CONTINUE</button>
      </div>
    </Shell>
  );
}
