import { Schema, model } from "mongoose";

const auditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
    ip: { type: String },
  },
  { timestamps: true }
);

export const AuditLog = model("AuditLog", auditLogSchema);

interface RecordAuditLogInput {
  actor: string;
  action: string;
  resource: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  ip?: string;
}

export async function recordAuditLog(input: RecordAuditLogInput) {
  await AuditLog.create(input);
}
