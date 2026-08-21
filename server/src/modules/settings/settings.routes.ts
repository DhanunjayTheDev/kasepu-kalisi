import { Router } from "express";
import { z } from "zod";
import { getSettings } from "./settings.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { recordAuditLog } from "../auditLogs/auditLog.model";

export const settingsRouter = Router();

settingsRouter.get("/", requireAdmin(), async (req, res) => {
  const settings = await getSettings();
  res.json({ settings });
});

const updateSchema = z.object({
  general: z
    .object({
      businessName: z.string().optional(),
      supportEmail: z.string().email().optional(),
      clientUrl: z.string().optional(),
      adminUrl: z.string().optional(),
    })
    .optional(),
  tax: z
    .object({
      gstin: z.string().optional(),
      invoicePrefix: z.string().optional(),
      cgstPercent: z.number().optional(),
      sgstPercent: z.number().optional(),
      igstPercent: z.number().optional(),
    })
    .optional(),
  reminders: z
    .object({
      intervalsDays: z.array(z.number()).optional(),
    })
    .optional(),
});

settingsRouter.patch("/", requireAdmin("super_admin"), validateBody(updateSchema), async (req, res) => {
  const current = await getSettings();
  const before = current.toObject();

  Object.assign(current, req.body);
  await current.save();

  await recordAuditLog({
    actor: req.auth!.sub,
    action: "settings.updated",
    resource: "platform",
    before,
    after: current.toObject(),
  });

  res.json({ settings: current });
});
