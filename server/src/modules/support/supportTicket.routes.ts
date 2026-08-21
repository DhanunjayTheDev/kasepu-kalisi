import { Router } from "express";
import { z } from "zod";
import { SupportTicket } from "./supportTicket.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { qs } from "../../utils/query-string";

export const supportTicketRouter = Router();

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
  booking: z.string().optional(),
});

supportTicketRouter.post("/", validateBody(createSchema), async (req, res) => {
  const ticket = await SupportTicket.create(req.body);
  res.status(201).json({ ticket });
});

supportTicketRouter.get("/", requireAdmin("super_admin", "support_staff"), async (req, res) => {
  const status = qs(req.query.status);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
  res.json({ tickets });
});

const updateSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved"]).optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
});

supportTicketRouter.patch(
  "/:id",
  requireAdmin("super_admin", "support_staff"),
  validateBody(updateSchema),
  async (req, res) => {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    if (!ticket) throw new ApiError(404, "Support ticket not found");
    res.json({ ticket });
  }
);
