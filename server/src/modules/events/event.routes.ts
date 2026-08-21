import { Router } from "express";
import { z } from "zod";
import { Event } from "./event.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { EVENT_STATUSES } from "../../types/enums";
import { recordAuditLog } from "../auditLogs/auditLog.model";
import { queueAnnouncementNotification } from "../notifications/notification.queue-helpers";

export const eventRouter = Router();

// Public: list events visible to attendees
eventRouter.get("/", async (req, res) => {
  const isAdminRequest = req.auth?.kind === "admin";
  const filter: Record<string, unknown> = isAdminRequest ? {} : { status: { $ne: "draft" } };

  const events = await Event.find(filter).sort({ date: 1 });
  res.json({ events });
});

eventRouter.get("/:slug", async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) throw new ApiError(404, "Event not found");
  if (event.status === "draft" && req.auth?.kind !== "admin") {
    throw new ApiError(404, "Event not found");
  }
  res.json({ event });
});

const venueSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  pincode: z.string().optional(),
  mapUrl: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  parkingAvailable: z.boolean().optional(),
  parkingCapacity: z.number().optional(),
  parkingFee: z.number().optional(),
  parkingInstructions: z.string().optional(),
  directions: z.string().optional(),
  landmarks: z.array(z.string()).optional(),
  publicTransport: z.string().optional(),
  emergencyExits: z.string().optional(),
  contactNumber: z.string().optional(),
});

const createEventSchema = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric with hyphens"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  city: z.string().min(1),
  date: z.coerce.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(EVENT_STATUSES).optional(),
  venue: venueSchema,
  priceFrom: z.number().optional(),
  featured: z.boolean().optional(),
  seatingEnabled: z.boolean().optional(),
  multiEntryEnabled: z.boolean().optional(),
  photographyConsentNotice: z.string().optional(),
});

eventRouter.post(
  "/",
  requireAdmin("super_admin", "event_manager"),
  validateBody(createEventSchema),
  async (req, res) => {
    const existing = await Event.findOne({ slug: req.body.slug });
    if (existing) throw new ApiError(409, "An event with this slug already exists");

    const event = await Event.create({ ...req.body, createdBy: req.auth!.sub });

    await recordAuditLog({ actor: req.auth!.sub, action: "event.created", resource: event.id });
    res.status(201).json({ event });
  }
);

eventRouter.patch(
  "/:id",
  requireAdmin("super_admin", "event_manager"),
  validateBody(createEventSchema.partial()),
  async (req, res) => {
    const before = await Event.findById(req.params.id);
    if (!before) throw new ApiError(404, "Event not found");

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });

    await recordAuditLog({
      actor: req.auth!.sub,
      action: "event.updated",
      resource: String(req.params.id),
      before: before.toObject(),
      after: event!.toObject(),
    });

    res.json({ event });
  }
);

const statusChangeSchema = z.object({
  status: z.enum(EVENT_STATUSES),
  reason: z.string().optional(),
});

eventRouter.patch(
  "/:id/status",
  requireAdmin("super_admin", "event_manager"),
  validateBody(statusChangeSchema),
  async (req, res) => {
    const { status, reason } = req.body as z.infer<typeof statusChangeSchema>;
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, "Event not found");

    const previousStatus = event.status;
    event.status = status;
    await event.save();

    await recordAuditLog({
      actor: req.auth!.sub,
      action: "event.status_changed",
      resource: event.id,
      before: { status: previousStatus },
      after: { status },
      metadata: { reason },
    });

    if (status === "cancelled" || status === "postponed") {
      await queueAnnouncementNotification({
        eventId: event.id,
        title: status === "cancelled" ? "Event Cancelled" : "Event Postponed",
        message: reason ?? `${event.title} has been ${status}.`,
      });
    }

    res.json({ event });
  }
);

eventRouter.delete("/:id", requireAdmin("super_admin"), async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new ApiError(404, "Event not found");

  await recordAuditLog({ actor: req.auth!.sub, action: "event.deleted", resource: String(req.params.id) });
  res.status(204).send();
});
