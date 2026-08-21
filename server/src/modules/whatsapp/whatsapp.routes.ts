import { Router } from "express";
import { WhatsAppLog } from "./whatsappLog.model";
import { requireAdmin } from "../../middleware/auth";

export const whatsappRouter = Router();

whatsappRouter.get("/logs", requireAdmin("super_admin"), async (req, res) => {
  const logs = await WhatsAppLog.find().sort({ createdAt: -1 }).limit(200);
  res.json({ logs });
});
