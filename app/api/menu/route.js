import { read, write, isAdmin, deny } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET() { return Response.json(await read("menu")); }
export async function PUT(req) {
  if (!(await isAdmin())) return deny();
  const body = await req.json();
  await write("menu", body);
  return Response.json(body);
}
