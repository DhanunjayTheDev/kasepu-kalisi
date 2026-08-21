import { Router } from "express";
import { EmailLog } from "./emailLog.model";
import { requireAdmin } from "../../middleware/auth";

export const emailRouter = Router();

emailRouter.get("/logs", requireAdmin("super_admin"), async (req, res) => {
  const logs = await EmailLog.find().sort({ createdAt: -1 }).limit(200);
  res.json({ logs });
});
