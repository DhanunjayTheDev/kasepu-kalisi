import { z } from "zod";
import { Artist } from "./artist.model";
import { createCrudRouter } from "../../utils/crud-router";

const artistSchema = z.object({
  event: z.string(),
  name: z.string().min(1),
  photoUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  bio: z.string().optional(),
  genre: z.string().optional(),
  performanceTime: z.string().optional(),
  socialLinks: z.array(z.string()).optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
});

export const artistRouter = createCrudRouter({
  model: Artist,
  createSchema: artistSchema,
  roles: ["super_admin", "event_manager"],
  eventFilterField: "event",
});
