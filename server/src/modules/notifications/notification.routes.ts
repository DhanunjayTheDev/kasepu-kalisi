import { Router } from "express";
import { Notification } from "./notification.model";
import { Booking } from "../bookings/booking.model";
import { requireUser } from "../../middleware/auth";

export const notificationRouter = Router();

notificationRouter.get("/mine", requireUser, async (req, res) => {
  const eventIds = await Booking.find({ user: req.auth!.sub, status: "confirmed" }).distinct("event");
  const notifications = await Notification.find({ event: { $in: eventIds } }).sort({ createdAt: -1 }).limit(50);
  res.json({ notifications });
});

notificationRouter.post("/:id/read", requireUser, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { readAt: new Date() });
  res.status(204).send();
});
