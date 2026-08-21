import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.string().default("mongodb://127.0.0.1:27017/kasepu-kalisi"),
  REDIS_URL: z.string().default("redis://127.0.0.1:6379"),

  JWT_SECRET: z.string().default("dev-jwt-secret-change-me"),
  JWT_REFRESH_SECRET: z.string().default("dev-refresh-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  EMAIL_PROVIDER: z.string().default("console"),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("tickets@kasepukalisi.com"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  WHATSAPP_API_KEY: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),

  GCP_PROJECT_ID: z.string().optional(),
  GCP_BUCKET_NAME: z.string().optional(),
  GCP_CREDENTIALS: z.string().optional(),

  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_URL: z.string().url().default("http://localhost:3001"),
  SERVER_URL: z.string().url().default("http://localhost:4000"),

  // Comma-separated extra browser origins allowed to call the API, on top of
  // CLIENT_URL and ADMIN_URL. Needed once the front-ends are deployed, since
  // their production origins differ from the local dev ones.
  CORS_ORIGINS: z.string().optional(),

  TICKET_RESERVATION_TTL_SECONDS: z.coerce.number().default(600),
  OTP_TTL_SECONDS: z.coerce.number().default(300),
  OTP_RATE_LIMIT_PER_HOUR: z.coerce.number().default(5),
});

export const env = envSchema.parse(process.env);
