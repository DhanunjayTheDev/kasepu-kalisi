import { Router } from "express";
import { Booking } from "../bookings/booking.model";
import { Ticket } from "../tickets/ticket.model";
import { Attendee } from "../attendees/attendee.model";
import { Payment } from "../payments/payment.model";
import { Refund } from "../refunds/refund.model";
import { CheckIn } from "../checkin/checkIn.model";
import { requireAdmin } from "../../middleware/auth";
import { toCsv } from "../../utils/csv";

export const reportRouter = Router();

reportRouter.get("/sales", requireAdmin("super_admin", "finance_manager", "event_manager"), async (req, res) => {
  const byTicketType = await Booking.aggregate([
    { $match: { status: { $in: ["confirmed", "refunded", "partially_refunded"] } } },
    { $group: { _id: "$ticketType", tickets: { $sum: "$quantity" }, revenue: { $sum: "$total" } } },
  ]);

  const byDay = await Booking.aggregate([
    { $match: { status: { $in: ["confirmed", "refunded", "partially_refunded"] } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        tickets: { $sum: "$quantity" },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ byTicketType, byDay });
});

reportRouter.get("/revenue", requireAdmin("super_admin", "finance_manager"), async (req, res) => {
  const byEvent = await Booking.aggregate([
    { $match: { status: { $in: ["confirmed", "refunded", "partially_refunded"] } } },
    {
      $group: {
        _id: "$event",
        gross: { $sum: "$subtotal" },
        discounts: { $sum: "$discount" },
        tax: { $sum: "$tax" },
        net: { $sum: "$total" },
      },
    },
    { $lookup: { from: "events", localField: "_id", foreignField: "_id", as: "event" } },
    { $unwind: "$event" },
  ]);

  const refunds = await Refund.aggregate([
    { $match: { status: "processed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({ byEvent, totalRefunded: refunds[0]?.total ?? 0 });
});

reportRouter.get(
  "/attendance",
  requireAdmin("super_admin", "event_manager", "finance_manager"),
  async (req, res) => {
    const byEvent = await Ticket.aggregate([
      {
        $group: {
          _id: "$event",
          sold: { $sum: 1 },
          checkedIn: { $sum: { $cond: [{ $gt: ["$entryCount", 0] }, 1, 0] } },
        },
      },
      { $lookup: { from: "events", localField: "_id", foreignField: "_id", as: "event" } },
      { $unwind: "$event" },
    ]);

    res.json({ byEvent });
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, unknown>;

const EXPORTABLE: Record<string, () => Promise<Row[]>> = {
  bookings: async () =>
    (await Booking.find().populate("event ticketType user").lean()).map((b: any) => ({
      bookingId: b.bookingId,
      event: b.event?.title,
      customer: b.contact?.fullName,
      mobile: b.contact?.mobile,
      email: b.contact?.email,
      ticketType: b.ticketType?.name,
      quantity: b.quantity,
      total: b.total,
      status: b.status,
      createdAt: b.createdAt,
    })),
  attendees: async () =>
    (await Attendee.find().populate("booking").lean()).map((a: any) => ({
      name: a.name,
      age: a.age,
      gender: a.gender,
      bookingId: a.booking?.bookingId,
    })),
  payments: async () =>
    (await Payment.find().populate("booking").lean()).map((p: any) => ({
      razorpayOrderId: p.razorpayOrderId,
      razorpayPaymentId: p.razorpayPaymentId,
      bookingId: p.booking?.bookingId,
      amount: p.amount,
      status: p.status,
      createdAt: p.createdAt,
    })),
  refunds: async () =>
    (await Refund.find().populate("booking").lean()).map((r: any) => ({
      bookingId: r.booking?.bookingId,
      amount: r.amount,
      reason: r.reason,
      status: r.status,
      processedAt: r.processedAt,
    })),
  checkins: async () =>
    (await CheckIn.find().populate("ticket staff").lean()).map((c: any) => ({
      ticketId: c.ticket?.ticketId,
      staff: c.staff?.name,
      gate: c.gate,
      device: c.device,
      createdAt: c.createdAt,
    })),
};

reportRouter.get(
  "/exports/:type",
  requireAdmin("super_admin", "finance_manager", "event_manager"),
  async (req, res) => {
    const type = String(req.params.type);
    const exporter = EXPORTABLE[type];
    if (!exporter) {
      return res.status(400).json({ error: { message: "Unknown export type" } });
    }

    const rows = await exporter();
    const csv = toCsv(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${type}.csv"`);
    res.send(csv);
  }
);
