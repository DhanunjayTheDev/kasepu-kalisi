import { Notification } from "./notification.model";
import { Booking } from "../bookings/booking.model";
import { queueEmail, type EmailJobData } from "../../queues/email.queue";
import { queueWhatsApp } from "../../queues/whatsapp.queue";

interface QueueAnnouncementInput {
  eventId: string;
  title: string;
  message: string;
  emailTemplate?: EmailJobData["template"];
}

// Fans an operational update out to every confirmed attendee of an event —
// used for cancellations, postponements, and admin-authored announcements.
export async function queueAnnouncementNotification({
  eventId,
  title,
  message,
  emailTemplate = "event_update",
}: QueueAnnouncementInput) {
  await Notification.create({ event: eventId, title, message, channel: "website" });

  const bookings = await Booking.find({ event: eventId, status: "confirmed" });

  const seenContacts = new Set<string>();
  for (const booking of bookings) {
    if (seenContacts.has(booking.contact.email)) continue;
    seenContacts.add(booking.contact.email);

    await queueEmail({
      to: booking.contact.email,
      template: emailTemplate,
      data: { idempotencyKey: `${emailTemplate}:${eventId}:${booking.contact.email}`, title, message },
    });

    await queueWhatsApp({
      to: booking.contact.mobile,
      template: "announcement",
      data: { title, message },
    });
  }
}
