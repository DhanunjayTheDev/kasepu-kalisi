import { Router } from "express";
import { z } from "zod";
import { Testimonial } from "./testimonial.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";
import { recordAuditLog } from "../auditLogs/auditLog.model";

export const testimonialRouter = Router();

const ROLES = ["super_admin", "content_manager"];

// Public listing hides drafts; staff see everything so the admin table can manage them.
testimonialRouter.get("/", async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.auth?.kind !== "admin") filter.status = "published";

  const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ items });
});

const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  city: z.string().optional(),
  quote: z.string().min(10),
  rating: z.number().min(1).max(5).optional(),
  eventName: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  order: z.number().optional(),
});

testimonialRouter.post("/", requireAdmin(...ROLES), validateBody(testimonialSchema), async (req, res) => {
  const item = await Testimonial.create(req.body);
  await recordAuditLog({ actor: req.auth!.sub, action: "testimonial.created", resource: item.id });
  res.status(201).json({ item });
});

testimonialRouter.patch("/:id", requireAdmin(...ROLES), validateBody(testimonialSchema.partial()), async (req, res) => {
  const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) throw new ApiError(404, "Testimonial not found");

  await recordAuditLog({ actor: req.auth!.sub, action: "testimonial.updated", resource: String(req.params.id) });
  res.json({ item });
});

testimonialRouter.delete("/:id", requireAdmin(...ROLES), async (req, res) => {
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Testimonial not found");

  await recordAuditLog({ actor: req.auth!.sub, action: "testimonial.deleted", resource: String(req.params.id) });
  res.status(204).send();
});
