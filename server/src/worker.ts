import { connectDatabase } from "./config/db";

async function main() {
  await connectDatabase();
  await import("./workers/index.js");
}

main().catch((err) => {
  console.error("Worker process failed to start", err);
  process.exit(1);
});
