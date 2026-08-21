import { Router } from "express";
import { TicketReservation } from "./ticketReservation.model";
import { requireAdmin } from "../../middleware/auth";
import { qs } from "../../utils/query-string";

export const ticketReservationRouter = Router();

ticketReservationRouter.get("/", requireAdmin("super_admin", "event_manager"), async (req, res) => {
  const status = qs(req.query.status);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const reservations = await TicketReservation.find(filter).populate("ticketType").sort({ createdAt: -1 }).limit(200);
  res.json({ reservations });
});
