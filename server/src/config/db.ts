import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("strictQuery", true);

export async function connectDatabase() {
  mongoose.connection.on("connected", () => console.log("MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("MongoDB error", err));

  await mongoose.connect(env.DATABASE_URL);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
