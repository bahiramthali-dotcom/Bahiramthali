# Bahiram Thali — Next.js

Next.js rebuild of https://jdacstudios.com/bahiram/ (Varhadi restaurant, Wakad, Pune).

## Pages
| Route | What |
|---|---|
| `/` | Home: hero, offer banner, 4 service tiles, contact |
| `/table` | Book a table (date → hour with flame offers → guests) |
| `/menu` | Menu & online order (cart → WhatsApp: delivery / pickup / dine-in pre-order) |
| `/party` | Party orders for 20+ people |
| `/space` | The Morning Studio booking (6–10 AM shifts) |
| `/bookings` | Customer's bookings saved on this device |
| `/account` | Name, links, owner panel |
| `/admin` | **Owner dashboard**: bookings (confirm/cancel/delete), dishes (add/edit/hide/price), rates, flame offers, closed days |

Bookings are sent to WhatsApp **and** saved to `data/bookings.json` for the dashboard. Menu and settings live in `data/menu.json` and `data/settings.json`.

## Run
```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD
npm run dev
```

> Hosting note: the dashboard writes JSON files, which works on a VPS / Node host (e.g. Hostinger Node, Render, Railway). On Vercel the filesystem is read-only — swap `lib/store.js` for a database (Vercel KV, Supabase, etc.).
