import { Schema, model } from "mongoose";

interface CounterDoc {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<CounterDoc>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = model<CounterDoc>("Counter", counterSchema);

export async function getNextSequence(key: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );
  return doc.seq;
}
