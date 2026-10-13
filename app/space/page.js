"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell, { Top, Counter } from "@/components/Shell";
import { useApi, nextDays, submitBooking, inr } from "@/lib/client";

const kinds = ["Yoga class", "Dance class", "Fitness / workout", "Workshop", "Community meet-up", "Something else"];

export default function Space() {
  const [s] = useApi("/api/settings", {});
  const router = useRouter();
  const days = nextDays();
  const [date, setDate] = useState(null);
  const [shift, setShift] = useState(null);
  const [kind, setKind] = useState(kinds[0]);
  const [people, setPeople] = useState(10);
  const rate = s.studioRate ?? 1999, adv = s.studioAdvance ?? 199;

  async function go() {
    const d = days.find((x) => x.iso === date);
    const msg = `Hi Bahiram Thali! Morning Studio booking:\n${d.day} ${d.date}, ${shift}\n${kind} · ${people} people\n${inr(rate)} per shift (${inr(adv)} advance)`;
    await submitBooking({ type: "studio", date, shift, kind, people, amount: rate }, msg);
    router.push("/bookings");
  }

  return (
    <Shell nav={false}>
      <div className="hero" style={{ height: 180, backgroundImage: "url(/img/bk-studio-hero.jpg)" }}>
        <Top kicker="Bahiram Thali · Wakad" title="The Morning Studio" sub="1,200 sq ft · AC · quiet — two 2-hour shifts, 6–10 AM daily" />
      </div>
      <div className="pad">
        <div className="scroll">{["❄️ Air-conditioned", "📐 1,200 sq ft", "🤫 Quiet mornings", "📍 Wakad"].map((t) => <span key={t} className="chip">{t}</span>)}</div>
        <div className="step">1 · Pick a date</div>
        <div className="scroll">
          {days.map((d) => (
            <button key={d.iso} className={"pill" + (date === d.iso ? " on" : "")} disabled={(s.closedDays || []).includes(d.iso)} onClick={() => setDate(d.iso)}>
              <div style={{ fontSize: 11 }}>{d.day}</div>{d.date}
            </button>
          ))}
        </div>
        <div className="step">2 · Pick a shift</div>
        <div className="grid2">
          {(s.studioShifts || []).map((x) => <button key={x} className={"pill" + (shift === x ? " on" : "")} disabled={!date} onClick={() => setShift(x)}>{x}</button>)}
        </div>
        <div className="step">3 · Your class</div>
        <div className="grid2">{kinds.map((k) => <button key={k} className={"pill" + (kind === k ? " on" : "")} onClick={() => setKind(k)}>{k}</button>)}</div>
        <Counter label="ATTENDEES" value={people} set={setPeople} max={60} />
        <p className="note">{inr(rate)} per 2-hour shift · {inr(adv)} advance to reserve, balance {inr(rate - adv)} on the day. Availability is confirmed by our team on WhatsApp.</p>
      </div>
      <div className="bar">
        <div><small>{date && shift ? `${shift} · ${kind}` : "Pick a slot above"}</small><b>Reserve for just {inr(adv)}</b></div>
        <button disabled={!date || !shift} onClick={go}>CONTINUE</button>
      </div>
    </Shell>
  );
}
