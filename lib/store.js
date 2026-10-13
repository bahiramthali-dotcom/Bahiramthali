import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

const dir = path.join(process.cwd(), "data");

export async function read(name) {
  try { return JSON.parse(await fs.readFile(path.join(dir, name + ".json"), "utf8")); }
  catch { return name === "settings" ? {} : []; }
}
export async function write(name, value) {
  await fs.writeFile(path.join(dir, name + ".json"), JSON.stringify(value, null, 2));
}
export async function isAdmin() {
  const c = (await cookies()).get("bk_admin")?.value;
  return !!c && c === (process.env.ADMIN_PASSWORD || "change-me");
}
export const deny = () => Response.json({ error: "Unauthorized" }, { status: 401 });
