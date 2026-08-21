import { Router } from "express";
import { z } from "zod";
import { Coupon } from "./coupon.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { COUPON_TYPES } from "../../types/enums";

export const couponRouter = Router();

couponRouter.get("/", requireAdmin("super_admin", "finance_manager", "event_manager"), async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ coupons });
});

const createSchema = z.object({
  code: z.string().min(3),
  type: z.enum(COUPON_TYPES),
  value: z.number().min(0),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  event: z.string().optional(),
  ticketType: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  usageLimit: z.number().min(1).optional(),
  perUserLimit: z.number().min(1).optional(),
  active: z.boolean().optional(),
});

couponRouter.post(
  "/",
  requireAdmin("super_admin", "finance_manager"),
  validateBody(createSchema),
  async (req, res) => {
    const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existing) throw new ApiError(409, "A coupon with this code already exists");

    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  }
);

couponRouter.patch(
  "/:id",
  requireAdmin("super_admin", "finance_manager"),
  validateBody(createSchema.partial()),
  async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    if (!coupon) throw new ApiError(404, "Coupon not found");
    res.json({ coupon });
  }
);

couponRouter.delete("/:id", requireAdmin("super_admin", "finance_manager"), async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, "Coupon not found");
  res.status(204).send();
});
