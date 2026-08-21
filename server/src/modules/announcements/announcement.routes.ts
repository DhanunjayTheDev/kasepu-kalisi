import { Router } from "express";
import { z } from "zod";
import { Announcement } from "./announcement.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { queueAnnouncementNotification } from "../notifications/notification.queue-helpers";
import { qs } from "../../utils/query-string";

export const announcementRouter = Router();

announcementRouter.get("/", async (req, res) => {
  const eventId = qs(req.query.event);
  const filter: Record<string, unknown> = { status: "active" };
  if (eventId) filter.event = eventId;
  const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
  res.json({ announcements });
});

const createSchema = z.object({
  event: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.enum(["low", "normal", "high"]).optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  notify: z.boolean().optional(),
});

announcementRouter.post(
  "/",
  requireAdmin("super_admin", "event_manager"),
  validateBody(createSchema),
  async (req, res) => {
    const { notify, ...body } = req.body as z.infer<typeof createSchema>;
    const announcement = await Announcement.create({ ...body, createdBy: req.auth!.sub, status: "active" });

    if (notify) {
      await queueAnnouncementNotification({
        eventId: announcement.event.toString(),
        title: announcement.title,
        message: announcement.content,
      });
    }

    res.status(201).json({ announcement });
  }
);

announcementRouter.patch(
  "/:id",
  requireAdmin("super_admin", "event_manager"),
  validateBody(createSchema.partial()),
  async (req, res) => {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    if (!announcement) throw new ApiError(404, "Announcement not found");
    res.json({ announcement });
  }
);

announcementRouter.delete("/:id", requireAdmin("super_admin", "event_manager"), async (req, res) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) throw new ApiError(404, "Announcement not found");
  res.status(204).send();
});
