import { Router } from "express";
import type { Model } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { ZodObject, ZodRawShape } from "zod";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { ApiError } from "../middleware/error-handler";
import { qs } from "./query-string";

interface CrudOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  createSchema: ZodObject<ZodRawShape>;
  roles?: string[];
  publicRead?: boolean;
  eventFilterField?: string;
  sort?: Record<string, 1 | -1>;
}

export function createCrudRouter({
  model,
  createSchema,
  roles = [],
  publicRead = true,
  eventFilterField,
  sort = { createdAt: 1 },
}: CrudOptions) {
  const router = Router();

  const list = async (req: import("express").Request, res: import("express").Response) => {
    const eventId = qs(req.query.event);
    const filter = eventFilterField && eventId ? { [eventFilterField]: eventId } : {};
    const items = await model.find(filter).sort(sort);
    res.json({ items });
  };

  if (publicRead) {
    router.get("/", list);
  } else {
    router.get("/", requireAdmin(...roles), list);
  }

  router.post("/", requireAdmin(...roles), validateBody(createSchema), async (req, res) => {
    const item = await model.create(req.body);
    res.status(201).json({ item });
  });

  router.patch("/:id", requireAdmin(...roles), validateBody(createSchema.partial()), async (req, res) => {
    const item = await model.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    if (!item) throw new ApiError(404, "Not found");
    res.json({ item });
  });

  router.delete("/:id", requireAdmin(...roles), async (req, res) => {
    const item = await model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, "Not found");
    res.status(204).send();
  });

  return router;
}
