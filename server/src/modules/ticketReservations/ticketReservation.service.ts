import { TicketType } from "../tickets/ticketType.model";
import { TicketReservation } from "./ticketReservation.model";
import { ApiError } from "../../middleware/error-handler";
import { env } from "../../config/env";
import { scheduleReservationExpiry, cancelReservationExpiry } from "../../queues/reservation-expiry.queue";

const TTL_MS = env.TICKET_RESERVATION_TTL_SECONDS * 1000;

// Atomic increment on a single document is race-safe in MongoDB: two concurrent
// requests can never both succeed past capacity, so inventory can't go negative.
export async function reserveInventory(ticketTypeId: string, quantity: number) {
  const ticketType = await TicketType.findOneAndUpdate(
    {
      _id: ticketTypeId,
      $expr: { $lte: [{ $add: ["$sold", "$reserved", quantity] }, "$capacity"] },
    },
    { $inc: { reserved: quantity } },
    { returnDocument: "after" }
  );

  if (!ticketType) {
    throw new ApiError(409, "Not enough tickets available");
  }

  const reservation = await TicketReservation.create({
    ticketType: ticketTypeId,
    quantity,
    status: "held",
    expiresAt: new Date(Date.now() + TTL_MS),
  });

  await scheduleReservationExpiry(reservation.id, TTL_MS);

  return reservation;
}

export async function attachReservationToBooking(reservationId: string, bookingId: string) {
  await TicketReservation.findByIdAndUpdate(reservationId, { booking: bookingId });
}

export async function confirmReservation(reservationId: string) {
  const reservation = await TicketReservation.findById(reservationId);
  if (!reservation || reservation.status !== "held") return;

  await TicketType.findByIdAndUpdate(reservation.ticketType, {
    $inc: { reserved: -reservation.quantity, sold: reservation.quantity },
  });

  reservation.status = "confirmed";
  await reservation.save();
  await cancelReservationExpiry(reservationId);
}

export async function releaseReservation(reservationId: string) {
  const reservation = await TicketReservation.findById(reservationId);
  if (!reservation || reservation.status !== "held") return;

  await TicketType.findByIdAndUpdate(reservation.ticketType, {
    $inc: { reserved: -reservation.quantity },
  });

  reservation.status = "released";
  await reservation.save();
  await cancelReservationExpiry(reservationId);
}

export async function expireReservation(reservationId: string) {
  const reservation = await TicketReservation.findById(reservationId);
  if (!reservation || reservation.status !== "held") return;

  await TicketType.findByIdAndUpdate(reservation.ticketType, {
    $inc: { reserved: -reservation.quantity },
  });

  reservation.status = "expired";
  await reservation.save();
}
