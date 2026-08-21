import { Router } from "express";
import { AuditLog } from "./auditLog.model";
import { requireAdmin } from "../../middleware/auth";

export const auditLogRouter = Router();

auditLogRouter.get("/", requireAdmin("super_admin"), async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 50, 200);

  const [logs, total] = await Promise.all([
    AuditLog.find()
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    AuditLog.countDocuments(),
  ]);

  res.json({ logs, pagination: { page, limit, total } });
});
