import { Coupon } from "./coupon.model";
import { Booking } from "../bookings/booking.model";
import { ApiError } from "../../middleware/error-handler";

interface ValidateCouponInput {
  code: string;
  userId: string;
  eventId: string;
  ticketTypeId: string;
  subtotal: number;
}

// Discounts are always computed here, server-side — the frontend never sends a
// discount amount that gets trusted directly.
export async function validateAndApplyCoupon({ code, userId, eventId, ticketTypeId, subtotal }: ValidateCouponInput) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) throw new ApiError(400, "Invalid coupon code");

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) throw new ApiError(400, "Coupon is not active yet");
  if (coupon.endDate && now > coupon.endDate) throw new ApiError(400, "Coupon has expired");

  if (coupon.event && coupon.event.toString() !== eventId) {
    throw new ApiError(400, "Coupon is not valid for this event");
  }
  if (coupon.ticketType && coupon.ticketType.toString() !== ticketTypeId) {
    throw new ApiError(400, "Coupon is not valid for this ticket type");
  }
  if (subtotal < coupon.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new ApiError(400, "Coupon usage limit reached");
  }

  const userUsageCount = await Booking.countDocuments({
    coupon: coupon.id,
    user: userId,
    status: { $nin: ["cancelled", "expired"] },
  });
  if (userUsageCount >= coupon.perUserLimit) {
    throw new ApiError(400, "You've already used this coupon");
  }

  let discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
  discount = Math.min(discount, subtotal);

  return { coupon, discount: Math.round(discount) };
}

export async function incrementCouponUsage(couponId: string) {
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usageCount: 1 } });
}
