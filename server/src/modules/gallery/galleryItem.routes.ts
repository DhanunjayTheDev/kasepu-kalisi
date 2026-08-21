import { z } from "zod";
import { GalleryItem } from "./galleryItem.model";
import { createCrudRouter } from "../../utils/crud-router";

const galleryItemSchema = z.object({
  event: z.string(),
  album: z.string().min(1),
  type: z.enum(["image", "video"]).optional(),
  url: z.string().min(1),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const galleryItemRouter = createCrudRouter({
  model: GalleryItem,
  createSchema: galleryItemSchema,
  roles: ["super_admin", "event_manager", "content_manager"],
  eventFilterField: "event",
  sort: { createdAt: -1 },
});
