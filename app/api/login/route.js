import { cookies } from "next/headers";
export async function POST(req) {
  const { password } = await req.json();
  if (password !== (process.env.ADMIN_PASSWORD || "change-me"))
    return Response.json({ error: "Wrong password" }, { status: 401 });
  (await cookies()).set("bk_admin", password, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return Response.json({ ok: true });
}
export async function DELETE() {
  (await cookies()).delete("bk_admin");
  return Response.json({ ok: true });
}
