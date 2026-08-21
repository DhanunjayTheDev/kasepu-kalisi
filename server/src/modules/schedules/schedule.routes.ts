import { z } from "zod";
import { Schedule } from "./schedule.model";
import { createCrudRouter } from "../../utils/crud-router";

const scheduleSchema = z.object({
  event: z.string(),
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().optional(),
  enabled: z.boolean().optional(),
});

export const scheduleRouter = createCrudRouter({
  model: Schedule,
  createSchema: scheduleSchema,
  roles: ["super_admin", "event_manager"],
  eventFilterField: "event",
  sort: { order: 1, time: 1 },
});
