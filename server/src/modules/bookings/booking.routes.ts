import { Router } from "express";
import { z } from "zod";
import { Booking } from "./booking.model";
import { Attendee } from "../attendees/attendee.model";
import { Event } from "../events/event.model";
import { TicketType } from "../tickets/ticketType.model";
import { Ticket } from "../tickets/ticket.model";
import { Refund } from "../refunds/refund.model";
import { requireUser, requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { generateBookingId } from "../../utils/ids";
import { GENDERS, DIETARY_PREFERENCES } from "../../types/enums";
import {
  reserveInventory,
  attachReservationToBooking,
  releaseReservation,
} from "../ticketReservations/ticketReservation.service";
import { validateAndApplyCoupon } from "../coupons/coupon.service";
import { getSettings } from "../settings/settings.model";
import { qs } from "../../utils/query-string";

export const bookingRouter = Router();

const attendeeInputSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(1).max(120),
  gender: z.enum(GENDERS),
});

const createBookingSchema = z.object({
  eventId: z.string(),
  ticketTypeId: z.string(),
  quantity: z.number().min(1).max(20),
  contact: z.object({
    fullName: z.string().min(2),
    mobile: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().email(),
    gender: z.enum(GENDERS).optional(),
    age: z.number().optional(),
    city: z.string().optional(),
  }),
  attendees: z.array(attendeeInputSchema),
  dietaryPreference: z.enum(DIETARY_PREFERENCES).optional(),
  specialRequirements: z.string().optional(),
  photoConsent: z.boolean().optional(),
  couponCode: z.string().optional(),
});

bookingRouter.post("/", requireUser, validateBody(createBookingSchema), async (req, res) => {
  const body = req.body as z.infer<typeof createBookingSchema>;

  if (body.attendees.length !== body.quantity) {
    throw new ApiError(400, "Attendee count must match ticket quantity");
  }

  const event = await Event.findById(body.eventId);
  if (!event) throw new ApiError(404, "Event not found");
  if (!["registration_open", "published"].includes(event.status)) {
    throw new ApiError(409, "Registration is not open for this event");
  }

  const ticketType = await TicketType.findOne({ _id: body.ticketTypeId, event: event.id });
  if (!ticketType) throw new ApiError(404, "Ticket type not found");
  if (body.quantity > ticketType.maxPerBooking) {
    throw new ApiError(400, `Maximum ${ticketType.maxPerBooking} tickets per booking`);
  }

  const subtotal = ticketType.price * body.quantity;

  let discount = 0;
  let couponId: string | undefined;
  if (body.couponCode) {
    const result = await validateAndApplyCoupon({
      code: body.couponCode,
      userId: req.auth!.sub,
      eventId: event.id,
      ticketTypeId: ticketType.id,
      subtotal,
    });
    discount = result.discount;
    couponId = result.coupon.id;
  }

  const settings = await getSettings();
  const taxableAmount = subtotal - discount;
  const taxRate = (settings.tax!.cgstPercent! + settings.tax!.sgstPercent!) / 100;
  const tax = Math.round(taxableAmount * taxRate);
  const total = taxableAmount + tax;

  const reservation = await reserveInventory(ticketType.id, body.quantity);

  try {
    const bookingId = await generateBookingId();

    const booking = await Booking.create({
      bookingId,
      user: req.auth!.sub,
      event: event.id,
      ticketType: ticketType.id,
      reservation: reservation.id,
      quantity: body.quantity,
      contact: body.contact,
      subtotal,
      discount,
      tax,
      total,
      coupon: couponId,
      status: "payment_pending",
      dietaryPreference: body.dietaryPreference,
      specialRequirements: body.specialRequirements,
      photoConsent: body.photoConsent ?? false,
    });

    await attachReservationToBooking(reservation.id, booking.id);

    const attendees = await Attendee.insertMany(
      body.attendees.map((a) => ({ booking: booking.id, name: a.name, age: a.age, gender: a.gender }))
    );

    res.status(201).json({ booking, attendees, reservation: { id: reservation.id, expiresAt: reservation.expiresAt } });
  } catch (err) {
    await releaseReservation(reservation.id);
    throw err;
  }
});

bookingRouter.get("/mine", requireUser, async (req, res) => {
  const bookings = await Booking.find({ user: req.auth!.sub }).populate("event ticketType").sort({ createdAt: -1 });
  res.json({ bookings });
});

bookingRouter.get("/:id", requireUser, async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.auth!.sub }).populate("event ticketType");
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json({ booking });
});

bookingRouter.get("/:id/tickets", requireUser, async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.auth!.sub });
  if (!booking) throw new ApiError(404, "Booking not found");

  const tickets = await Ticket.find({ booking: booking.id }).populate("ticketType");
  res.json({ tickets });
});

// Admin: list all bookings
bookingRouter.get("/", requireAdmin(), async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const filter: Record<string, unknown> = {};
  if (req.query.event) filter.event = req.query.event;
  if (req.query.status) filter.status = req.query.status;

  const search = qs(req.query.q)?.trim();
  if (search) {
    // Escaped so a guest's name containing regex characters can't alter the query.
    const term = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { bookingId: term },
      { "contact.fullName": term },
      { "contact.mobile": term },
      { "contact.email": term },
    ];
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("event ticketType user")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  res.json({ bookings, pagination: { page, limit, total } });
});

const cancelSchema = z.object({ reason: z.string().optional() });

bookingRouter.post("/:id/cancel", requireUser, validateBody(cancelSchema), async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.auth!.sub });
  if (!booking) throw new ApiError(404, "Booking not found");
  if (!["confirmed", "payment_pending"].includes(booking.status)) {
    throw new ApiError(409, "This booking can no longer be cancelled");
  }

  const wasConfirmed = booking.status === "confirmed";
  booking.status = wasConfirmed ? "refund_requested" : "cancelled";
  booking.cancelledAt = new Date();
  booking.cancellationReason = req.body.reason;
  await booking.save();

  if (booking.reservation) {
    await releaseReservation(booking.reservation.toString());
  }

  if (wasConfirmed) {
    const event = await Event.findById(booking.event);
    const policy = event?.cancellationPolicy ?? { deadlineDays: 3, refundPercentage: 0, fixedFee: 0 };
    const daysUntilEvent = event ? (event.date.getTime() - Date.now()) / 86_400_000 : 0;

    const eligible = daysUntilEvent >= policy.deadlineDays;
    const refundAmount = eligible
      ? Math.max(Math.round((booking.total * policy.refundPercentage) / 100) - policy.fixedFee, 0)
      : 0;

    await Refund.create({
      booking: booking.id,
      payment: booking.payment,
      amount: refundAmount,
      reason: req.body.reason,
      status: "requested",
    });
  }

  res.json({ booking });
});
