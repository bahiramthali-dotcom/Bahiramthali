import { read, write, isAdmin, deny } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await isAdmin())) return deny();
  return Response.json(await read("bookings"));
}
export async function POST(req) {
  const b = await req.json();
  const list = await read("bookings");
  const item = { ...b, id: Date.now().toString(36), status: "pending", created: new Date().toISOString() };
  list.unshift(item);
  await write("bookings", list.slice(0, 2000));
  return Response.json(item);
}
export async function PATCH(req) {
  if (!(await isAdmin())) return deny();
  const { id, status } = await req.json();
  const list = await read("bookings");
  const b = list.find(x => x.id === id);
  if (b) b.status = status;
  await write("bookings", list.filter(x => status !== "deleted" || x.id !== id));
  return Response.json({ ok: true });
}
