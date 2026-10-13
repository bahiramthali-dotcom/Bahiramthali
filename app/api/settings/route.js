import { read, write, isAdmin, deny } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET() { return Response.json(await read("settings")); }
export async function PUT(req) {
  if (!(await isAdmin())) return deny();
  const body = await req.json();
  await write("settings", body);
  return Response.json(body);
}
