import crypto from "crypto";
import { redis } from "../config/redis";
import { env } from "../config/env";

function otpKey(mobile: string) {
  return `otp:${mobile}`;
}

function otpRateKey(mobile: string) {
  return `otp:rate:${mobile}`;
}

export async function issueOtp(mobile: string): Promise<string> {
  const attempts = await redis.incr(otpRateKey(mobile));
  if (attempts === 1) {
    await redis.expire(otpRateKey(mobile), 3600);
  }
  if (attempts > env.OTP_RATE_LIMIT_PER_HOUR) {
    throw new Error("Too many OTP requests. Try again later.");
  }

  const otp = crypto.randomInt(1000, 9999).toString();
  await redis.set(otpKey(mobile), otp, "EX", env.OTP_TTL_SECONDS);
  return otp;
}

export async function verifyOtp(mobile: string, otp: string): Promise<boolean> {
  const stored = await redis.get(otpKey(mobile));
  if (!stored || stored !== otp) return false;
  await redis.del(otpKey(mobile));
  return true;
}
