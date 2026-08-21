import mongoose from "mongoose";
import { env } from "./config/env";

async function main() {
  await mongoose.connect(env.DATABASE_URL);
  const cols = await mongoose.connection.db!.listCollections().toArray();
  const rows: [string, number][] = [];
  for (const c of cols.map((c) => c.name).sort()) {
    rows.push([c, await mongoose.connection.db!.collection(c).countDocuments()]);
  }
  const total = rows.reduce((sum, [, n]) => sum + n, 0);
  const empty = rows.filter(([, n]) => n === 0);
  console.log(rows.map(([n, c]) => `${n.padEnd(20)} ${c}`).join("\n"));
  console.log(`\ncollections: ${rows.length} | total docs: ${total} | empty: ${empty.length ? empty.map((e) => e[0]).join(", ") : "none"}`);
  await mongoose.disconnect();
}

main();
