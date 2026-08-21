import type { NextFunction, Request, Response } from "express";

const COLOR = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

const METHOD_COLOR: Record<string, string> = {
  GET: COLOR.cyan,
  POST: COLOR.green,
  PATCH: COLOR.yellow,
  PUT: COLOR.yellow,
  DELETE: COLOR.red,
};

function statusColor(status: number) {
  if (status >= 500) return COLOR.red;
  if (status >= 400) return COLOR.yellow;
  if (status >= 300) return COLOR.magenta;
  return COLOR.green;
}

/** Fields that must never reach the logs, even in development. */
const REDACTED = new Set([
  "password",
  "passwordHash",
  "otp",
  "token",
  "accessToken",
  "refreshToken",
  "razorpaySignature",
  "razorpay_signature",
  "qrToken",
]);

function redact(value: unknown, depth = 0): unknown {
  if (depth > 3 || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    out[key] = REDACTED.has(key) ? "[redacted]" : redact(val, depth + 1);
  }
  return out;
}

function preview(body: unknown) {
  if (!body || typeof body !== "object" || Object.keys(body as object).length === 0) return "";
  const json = JSON.stringify(redact(body));
  return json.length > 300 ? `${json.slice(0, 300)}…` : json;
}

/**
 * Logs one line per API call: method, path, status, duration, caller and — for
 * writes — a redacted body preview. Sensitive fields never appear.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const method = req.method.padEnd(6);
    const mColor = METHOD_COLOR[req.method] ?? COLOR.dim;
    const sColor = statusColor(res.statusCode);

    const caller = req.auth ? `${req.auth.kind}:${req.auth.role ?? req.auth.sub}` : "anon";
    const query = Object.keys(req.query).length ? ` ${COLOR.dim}?${JSON.stringify(redact(req.query))}${COLOR.reset}` : "";
    const body = ["POST", "PATCH", "PUT"].includes(req.method) ? preview(req.body) : "";
    const bodyOut = body ? ` ${COLOR.dim}${body}${COLOR.reset}` : "";

    console.log(
      `${COLOR.dim}${new Date().toISOString()}${COLOR.reset} ` +
        `${mColor}${method}${COLOR.reset} ${req.originalUrl} ` +
        `${sColor}${res.statusCode}${COLOR.reset} ` +
        `${COLOR.dim}${ms.toFixed(1)}ms · ${caller}${COLOR.reset}` +
        query +
        bodyOut
    );
  });

  next();
}
