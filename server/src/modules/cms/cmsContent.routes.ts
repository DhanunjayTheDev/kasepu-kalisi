import { Router } from "express";
import { z } from "zod";
import { CmsContent, getCmsContent } from "./cmsContent.model";
import { requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";

export const cmsContentRouter = Router();

cmsContentRouter.get("/:key", async (req, res) => {
  const content = await getCmsContent(req.params.key);
  if (!content) throw new ApiError(404, "Content not found");
  res.json({ content });
});

const updateSchema = z.object({ data: z.record(z.string(), z.unknown()) });

cmsContentRouter.patch(
  "/:key",
  requireAdmin("super_admin", "content_manager"),
  validateBody(updateSchema),
  async (req, res) => {
    const content = await CmsContent.findOneAndUpdate(
      { key: req.params.key },
      { data: req.body.data },
      { new: true, upsert: true }
    );
    res.json({ content });
  }
);
