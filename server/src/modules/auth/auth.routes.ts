import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../users/user.model";
import { Staff } from "../staff/staff.model";
import { issueOtp, verifyOtp } from "../../utils/otp";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { validateBody } from "../../middleware/validate";
import { otpRateLimiter, authRateLimiter } from "../../middleware/rate-limit";
import { ApiError } from "../../middleware/error-handler";

export const authRouter = Router();

const requestOtpSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

authRouter.post("/otp/request", otpRateLimiter, validateBody(requestOtpSchema), async (req, res) => {
  const { mobile } = req.body as z.infer<typeof requestOtpSchema>;
  const otp = await issueOtp(mobile);

  if (process.env.NODE_ENV !== "production") {
    console.log(`[dev] OTP for ${mobile}: ${otp}`);
  }
  // Real delivery happens via the notifications/whatsapp queue, not synchronously here.

  res.json({ message: "OTP sent" });
});

const verifyOtpSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(4),
  fullName: z.string().min(2).optional(),
});

authRouter.post("/otp/verify", validateBody(verifyOtpSchema), async (req, res) => {
  const { mobile, otp, fullName } = req.body as z.infer<typeof verifyOtpSchema>;

  const valid = await verifyOtp(mobile, otp);
  if (!valid) throw new ApiError(400, "Invalid or expired OTP");

  let user = await User.findOne({ mobile });
  if (!user) {
    user = await User.create({ fullName: fullName ?? "Guest", mobile, mobileVerifiedAt: new Date() });
  } else if (!user.mobileVerifiedAt) {
    user.mobileVerifiedAt = new Date();
    await user.save();
  }

  const accessToken = signAccessToken({ sub: user.id, kind: "user" });
  const refreshToken = signRefreshToken({ sub: user.id, kind: "user" });

  res.json({ accessToken, refreshToken, user });
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post("/admin/login", authRateLimiter, validateBody(adminLoginSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof adminLoginSchema>;

  const staff = await Staff.findOne({ email });
  if (!staff || staff.status !== "active") throw new ApiError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const accessToken = signAccessToken({ sub: staff.id, kind: "admin", role: staff.role });
  const refreshToken = signRefreshToken({ sub: staff.id, kind: "admin", role: staff.role });

  res.json({
    accessToken,
    refreshToken,
    staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role },
  });
});

const refreshSchema = z.object({ refreshToken: z.string() });

authRouter.post("/refresh", validateBody(refreshSchema), (req, res) => {
  const { refreshToken } = req.body as z.infer<typeof refreshSchema>;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const accessToken = signAccessToken({ sub: payload.sub, kind: payload.kind, role: payload.role });
  res.json({ accessToken });
});
