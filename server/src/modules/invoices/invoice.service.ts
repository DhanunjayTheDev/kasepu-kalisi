import { Invoice } from "./invoice.model";
import { Booking } from "../bookings/booking.model";
import { getSettings } from "../settings/settings.model";
import { getNextSequence } from "../../utils/counter.model";
import { generateInvoiceNumber } from "../../utils/ids";

export async function generateInvoiceForBooking(bookingId: string) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return null;

  const settings = await getSettings();
  const seq = await getNextSequence("invoice");
  const invoiceNumber = generateInvoiceNumber(settings.tax!.invoicePrefix!, seq);

  return Invoice.create({
    invoiceNumber,
    booking: booking.id,
    subtotal: booking.subtotal,
    discount: booking.discount,
    tax: booking.tax,
    total: booking.total,
    businessName: settings.general!.businessName,
    gstin: settings.tax!.gstin,
  });
}
