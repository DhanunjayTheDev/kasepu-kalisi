import { Router } from "express";
import { z } from "zod";
import { TicketType } from "./ticketType.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { recordAuditLog } from "../auditLogs/auditLog.model";
import { qs } from "../../utils/query-string";

export const ticketTypeRouter = Router();

ticketTypeRouter.get("/", async (req, res) => {
  const event = qs(req.query.event);
  const filter = event ? { event } : {};
  const ticketTypes = await TicketType.find(filter).sort({ price: 1 });
  res.json({ ticketTypes });
});

const createSchema = z.object({
  event: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  capacity: z.number().min(0),
  salesStart: z.coerce.date().optional(),
  salesEnd: z.coerce.date().optional(),
  maxPerBooking: z.number().min(1).max(20).optional(),
  benefits: z.array(z.string()).optional(),
  dinnerIncluded: z.boolean().optional(),
  seatingCategory: z.string().optional(),
  parkingIncluded: z.boolean().optional(),
  vipAccess: z.boolean().optional(),
  status: z.enum(["draft", "on_sale", "paused", "sold_out"]).optional(),
});

ticketTypeRouter.post(
  "/",
  requireAdmin("super_admin", "event_manager"),
  validateBody(createSchema),
  async (req, res) => {
    const ticketType = await TicketType.create(req.body);
    await recordAuditLog({ actor: req.auth!.sub, action: "ticket_type.created", resource: ticketType.id });
    res.status(201).json({ ticketType });
  }
);

ticketTypeRouter.patch(
  "/:id",
  requireAdmin("super_admin", "event_manager"),
  validateBody(createSchema.partial()),
  async (req, res) => {
    const before = await TicketType.findById(req.params.id);
    if (!before) throw new ApiError(404, "Ticket type not found");

    const ticketType = await TicketType.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await recordAuditLog({
      actor: req.auth!.sub,
      action: "ticket_type.price_changed",
      resource: String(req.params.id),
      before: { price: before.price },
      after: { price: ticketType!.price },
    });

    res.json({ ticketType });
  }
);

ticketTypeRouter.delete("/:id", requireAdmin("super_admin", "event_manager"), async (req, res) => {
  const ticketType = await TicketType.findByIdAndDelete(req.params.id);
  if (!ticketType) throw new ApiError(404, "Ticket type not found");
  res.status(204).send();
});
