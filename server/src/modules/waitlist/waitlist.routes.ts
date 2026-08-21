import { Router } from "express";
import { z } from "zod";
import { Waitlist } from "./waitlist.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { queueWaitlistNotification } from "../../queues/waitlist.queue";
import { qs } from "../../utils/query-string";

export const waitlistRouter = Router();

const joinSchema = z.object({
  name: z.string().min(2),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email().optional(),
  event: z.string(),
  ticketType: z.string(),
  quantity: z.number().min(1).max(10).optional(),
});

waitlistRouter.post("/", validateBody(joinSchema), async (req, res) => {
  const existing = await Waitlist.findOne({
    mobile: req.body.mobile,
    event: req.body.event,
    ticketType: req.body.ticketType,
  });
  if (existing) throw new ApiError(409, "You're already on the waitlist for this ticket type");

  const entry = await Waitlist.create(req.body);
  res.status(201).json({ waitlistEntry: entry });
});

waitlistRouter.get("/", requireAdmin("super_admin", "event_manager", "registration_manager"), async (req, res) => {
  const eventId = qs(req.query.event);
  const filter = eventId ? { event: eventId } : {};
  const entries = await Waitlist.find(filter).populate("event ticketType").sort({ createdAt: 1 });
  res.json({ entries });
});

waitlistRouter.post(
  "/:id/notify",
  requireAdmin("super_admin", "event_manager", "registration_manager"),
  async (req, res) => {
    const entry = await Waitlist.findById(req.params.id);
    if (!entry) throw new ApiError(404, "Waitlist entry not found");

    entry.notifiedAt = new Date();
    await entry.save();

    await queueWaitlistNotification(entry.id);
    res.json({ waitlistEntry: entry });
  }
);
