import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { apiRateLimiter } from "./middleware/rate-limit";
import { optionalAuth } from "./middleware/auth";
import { requestLogger } from "./middleware/request-logger";

import { paymentWebhookRouter } from "./modules/payments/payment.webhook";

import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/users/user.routes";
import { staffRouter } from "./modules/staff/staff.routes";
import { eventRouter } from "./modules/events/event.routes";
import { scheduleRouter } from "./modules/schedules/schedule.routes";
import { artistRouter } from "./modules/artists/artist.routes";
import { menuItemRouter } from "./modules/menus/menuItem.routes";
import { galleryItemRouter } from "./modules/gallery/galleryItem.routes";
import { ticketTypeRouter } from "./modules/tickets/ticketType.routes";
import { ticketReservationRouter } from "./modules/ticketReservations/ticketReservation.routes";
import { bookingRouter } from "./modules/bookings/booking.routes";
import { attendeeRouter } from "./modules/attendees/attendee.routes";
import { ticketRouter } from "./modules/tickets/ticket.routes";
import { qrRouter } from "./modules/qr/qr.routes";
import { paymentRouter } from "./modules/payments/payment.routes";
import { refundRouter } from "./modules/refunds/refund.routes";
import { couponRouter } from "./modules/coupons/coupon.routes";
import { waitlistRouter } from "./modules/waitlist/waitlist.routes";
import { checkinRouter } from "./modules/checkin/checkin.routes";
import { auditLogRouter } from "./modules/auditLogs/auditLog.routes";
import { announcementRouter } from "./modules/announcements/announcement.routes";
import { notificationRouter } from "./modules/notifications/notification.routes";
import { emailRouter } from "./modules/email/email.routes";
import { whatsappRouter } from "./modules/whatsapp/whatsapp.routes";
import { invoiceRouter } from "./modules/invoices/invoice.routes";
import { reportRouter } from "./modules/reports/report.routes";
import { supportTicketRouter } from "./modules/support/supportTicket.routes";
import { settingsRouter } from "./modules/settings/settings.routes";
import { cmsContentRouter } from "./modules/cms/cmsContent.routes";
import { faqItemRouter } from "./modules/cms/faqItem.routes";
import { testimonialRouter } from "./modules/cms/testimonial.routes";

export const app = express();

/**
 * Allowed browser origins, entirely env-driven: CLIENT_URL, ADMIN_URL and any
 * comma-separated extras in CORS_ORIGINS. Trailing slashes are stripped because
 * a browser's Origin header never has one, but hand-written env values often do.
 */
const allowedOrigins = [env.CLIENT_URL, env.ADMIN_URL, ...(env.CORS_ORIGINS?.split(",") ?? [])]
  .map((value) => value.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin (curl, server-to-server, webhooks) aren't
      // subject to the browser same-origin policy, so there's nothing to block.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin.replace(/\/+$/, ""))) return callback(null, true);

      // Deny by omitting the header rather than throwing: the browser blocks the
      // response either way, and this keeps disallowed origins out of the 5xx logs.
      console.warn(`CORS: blocked origin ${origin} (add it to CORS_ORIGINS to allow)`);
      callback(null, false);
    },
    credentials: true,
  })
);

console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);

// Mounted before express.json() — Razorpay's webhook signature is computed over
// the raw request bytes, so this route must never see a parsed body.
app.use("/api/payments/webhook", paymentWebhookRouter);

app.use(express.json());
app.use(apiRateLimiter);
// Non-rejecting: lets public routes vary their response for signed-in staff.
app.use(optionalAuth);
// After optionalAuth so each line can name the caller.
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/staff", staffRouter);
app.use("/api/events", eventRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/artists", artistRouter);
app.use("/api/menu-items", menuItemRouter);
app.use("/api/gallery", galleryItemRouter);
app.use("/api/ticket-types", ticketTypeRouter);
app.use("/api/ticket-reservations", ticketReservationRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/attendees", attendeeRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/qr", qrRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/refunds", refundRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/waitlist", waitlistRouter);
app.use("/api/checkin", checkinRouter);
app.use("/api/audit-logs", auditLogRouter);
app.use("/api/announcements", announcementRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/email", emailRouter);
app.use("/api/whatsapp", whatsappRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/reports", reportRouter);
app.use("/api/support", supportTicketRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/cms", cmsContentRouter);
app.use("/api/faq", faqItemRouter);
app.use("/api/testimonials", testimonialRouter);

app.use(notFoundHandler);
app.use(errorHandler);
