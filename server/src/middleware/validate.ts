import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ApiError } from "./error-handler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, result.error.issues.map((i) => i.message).join(", "));
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      throw new ApiError(400, result.error.issues.map((i) => i.message).join(", "));
    }
    req.validatedQuery = result.data as Record<string, unknown>;
    next();
  };
}
