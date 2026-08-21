import { Router } from "express";
import { Invoice } from "./invoice.model";
import { Booking } from "../bookings/booking.model";
import { requireUser, requireAdmin } from "../../middleware/auth";
import { ApiError } from "../../middleware/error-handler";

export const invoiceRouter = Router();

invoiceRouter.get("/booking/:bookingId", requireUser, async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, user: req.auth!.sub });
  if (!booking) throw new ApiError(404, "Booking not found");

  const invoice = await Invoice.findOne({ booking: booking.id });
  if (!invoice) throw new ApiError(404, "Invoice not yet generated");

  res.json({ invoice });
});

invoiceRouter.get("/", requireAdmin("super_admin", "finance_manager"), async (req, res) => {
  const invoices = await Invoice.find().populate("booking").sort({ createdAt: -1 }).limit(200);
  res.json({ invoices });
});
