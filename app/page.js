"use client";
import Link from "next/link";
import Shell from "@/components/Shell";
import { useApi } from "@/lib/client";

const tiles = [
  ["/table", "bk-dining-real.jpg", "🍴 DINE IN", "Book a Table", "Lunch & dinner, hourly · ₹49 reservation"],
  ["/menu", "bk-dish-mutton.jpg", "🛵 DELIVERY · PICKUP · DINE-IN", "Order Food Online", "Free delivery above ₹999 · 20% off dine-in pre-orders"],
  ["/space", "bk-studio-hero.jpg", "🪷 SPACE FOR RENT", "The Morning Studio", "1,200 sq ft · AC · quiet — classes & events, 6–10 AM daily · ₹1,999/shift"],
  ["/party", "bk-hero-real.jpg", "🎉 BULK · 20+ PEOPLE · PUNE", "Bahiram Party Orders", "Handis by the kilo for 20+ people · pickup free or ₹500 Pune delivery"],
];

export default function Home() {
  const [s] = useApi("/api/settings", {});
  return (
    <Shell>
      <header className="hero" style={{ backgroundImage: "url(/img/bk-hero-real.jpg)" }}>
        <div className="chiprow"><span className="chip">WAKAD · PUNE</span><span className="chip">🔥 VARHADI</span></div>
        <img className="logo" src="/img/bk-logo-card.jpg" alt="Bahiram Thali" />
        <p className="tag">Slow-cooked Varhadi food by night.<br />A quiet AC studio every morning.</p>
      </header>
      <main className="pad">
        <Link href="/table" className="offer"><span>🔥</span><span>{s.offerBanner || "Up to 50% off on selected hours — watch for the flame badge while booking."}</span></Link>
        {tiles.map(([href, img, chip, h, p]) => (
          <Link key={href} href={href} className="tile" style={{ backgroundImage: `url(/img/${img})` }}>
            <span className="chip">{chip}</span><h3>{h}</h3><p>{p}</p><span className="go">→</span>
          </Link>
        ))}
        <div className="info">
          <a href="https://www.google.com/maps/search/?api=1&query=Bahiram+Thali+Wakad+Pune" target="_blank">📍 <b>Shop 12, Omega Commercial Complex,<br />Wakad, Pune 411057</b></a><br />
          <a href="tel:+918956922916">📞 <b>+91 89569 22916</b></a><br /><br />
          <b>Dining</b> 12–3 PM · 6–11 PM<br /><b>Studio</b> 6–8 & 8–10 AM daily<br /><br />
          <a href="https://instagram.com/bahiramthali" target="_blank">BAHIRAM THALI · <b>@BAHIRAMTHALI</b></a>
        </div>
      </main>
    </Shell>
  );
}
