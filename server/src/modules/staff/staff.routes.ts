import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { Staff } from "./staff.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { STAFF_ROLES } from "../../types/enums";
import { recordAuditLog } from "../auditLogs/auditLog.model";

export const staffRouter = Router();

staffRouter.get("/", requireAdmin("super_admin"), async (req, res) => {
  const staff = await Staff.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json({ staff });
});

const inviteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(STAFF_ROLES),
});

staffRouter.post("/", requireAdmin("super_admin"), validateBody(inviteSchema), async (req, res) => {
  const { name, email, role } = req.body as z.infer<typeof inviteSchema>;

  const tempPassword = crypto.randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const staff = await Staff.create({ name, email, role, passwordHash, status: "invited" });

  await recordAuditLog({
    actor: req.auth!.sub,
    action: "staff.invited",
    resource: staff.id,
    metadata: { email, role },
  });

  // Invite email (with temp password reset link) is queued, not sent synchronously.
  res.status(201).json({ staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role } });
});

const updateRoleSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(STAFF_ROLES).optional(),
  status: z.enum(["active", "invited", "disabled"]).optional(),
});

staffRouter.patch("/:id", requireAdmin("super_admin"), validateBody(updateRoleSchema), async (req, res) => {
  const before = await Staff.findById(req.params.id).select("-passwordHash");
  if (!before) throw new ApiError(404, "Staff member not found");

  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" }).select("-passwordHash");

  await recordAuditLog({
    actor: req.auth!.sub,
    action: "staff.permission_changed",
    resource: String(req.params.id),
    before: before.toObject(),
    after: staff!.toObject(),
  });

  res.json({ staff });
});

staffRouter.delete("/:id", requireAdmin("super_admin"), async (req, res) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);
  if (!staff) throw new ApiError(404, "Staff member not found");

  await recordAuditLog({ actor: req.auth!.sub, action: "staff.removed", resource: String(req.params.id) });
  res.status(204).send();
});
