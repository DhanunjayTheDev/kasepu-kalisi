import { Payment } from "./payment.model";
import { Booking } from "../bookings/booking.model";
import { confirmReservation, releaseReservation } from "../ticketReservations/ticketReservation.service";
import { incrementCouponUsage } from "../coupons/coupon.service";
import { generateTicketsForBooking } from "../tickets/ticket.service";
import { generateInvoiceForBooking } from "../invoices/invoice.service";
import { queueEmail } from "../../queues/email.queue";

interface RazorpayPaymentDetails {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  method?: string;
}

// Idempotent: the atomic findOneAndUpdate below only succeeds the first time a given
// order transitions out of "created"/"pending", so webhook retries are safe no-ops.
export async function confirmBookingPayment(details: RazorpayPaymentDetails) {
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: details.razorpayOrderId, status: { $in: ["created", "pending", "authorized"] } },
    {
      status: "captured",
      razorpayPaymentId: details.razorpayPaymentId,
      razorpaySignature: details.razorpaySignature,
      method: details.method,
      webhookProcessedAt: new Date(),
    },
    { returnDocument: "after" }
  );

  if (!payment) return null; // Already processed or unknown order — nothing to do.

  const booking = await Booking.findById(payment.booking);
  if (!booking || booking.status === "confirmed") return payment;

  booking.status = "confirmed";
  booking.payment = payment._id;
  await booking.save();

  if (booking.reservation) await confirmReservation(booking.reservation.toString());
  if (booking.coupon) await incrementCouponUsage(booking.coupon.toString());

  await generateTicketsForBooking(booking.id);
  await generateInvoiceForBooking(booking.id);

  return payment;
}

export async function markBookingPaymentFailed(razorpayOrderId: string) {
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId, status: { $in: ["created", "pending", "authorized"] } },
    { status: "failed" },
    { returnDocument: "after" }
  );
  if (!payment) return null;

  const booking = await Booking.findById(payment.booking);
  if (!booking) return payment;

  booking.status = "cancelled";
  await booking.save();

  if (booking.reservation) await releaseReservation(booking.reservation.toString());

  await queueEmail({
    to: booking.contact.email,
    template: "payment_failed",
    data: { idempotencyKey: `payment-failed:${payment.id}`, bookingId: booking.bookingId },
  });

  return payment;
}
