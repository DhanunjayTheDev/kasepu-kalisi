import { z } from "zod";
import { FaqItem } from "./faqItem.model";
import { createCrudRouter } from "../../utils/crud-router";

const faqSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
  order: z.number().optional(),
});

export const faqItemRouter = createCrudRouter({
  model: FaqItem,
  createSchema: faqSchema,
  roles: ["super_admin", "content_manager"],
  sort: { order: 1, createdAt: 1 },
});
