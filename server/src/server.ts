import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/db";

async function main() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Kasepu Kalisi API listening on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Server failed to start", err);
  process.exit(1);
});
