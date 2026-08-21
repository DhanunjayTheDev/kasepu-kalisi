import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type AccessTokenPayload } from "../utils/jwt";
import { ApiError } from "./error-handler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AccessTokenPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

/**
 * Populates req.auth when a valid token is present, but never rejects. Routes that
 * are public yet behave differently for staff (e.g. events listing exposing drafts)
 * depend on this running globally.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.auth = verifyAccessToken(token);
    } catch {
      // Ignore — the request continues as anonymous.
    }
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, "Authentication required");

  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired session");
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.auth?.kind !== "user") throw new ApiError(403, "Attendee access required");
    next();
  });
}

export function requireAdmin(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      if (req.auth?.kind !== "admin") throw new ApiError(403, "Admin access required");
      if (roles.length > 0 && !roles.includes(req.auth.role ?? "")) {
        throw new ApiError(403, "Insufficient permissions");
      }
      next();
    });
  };
}
