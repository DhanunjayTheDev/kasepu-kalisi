import { z } from "zod";
import { MenuItem } from "./menuItem.model";
import { createCrudRouter } from "../../utils/crud-router";

const menuItemSchema = z.object({
  event: z.string(),
  category: z.enum([
    "welcome_drink",
    "starters",
    "main_course",
    "rice",
    "dal",
    "curries",
    "bread",
    "desserts",
    "beverages",
  ]),
  name: z.string().min(1),
  dietary: z.enum(["vegetarian", "non_vegetarian", "vegan", "jain"]),
  allergens: z.array(z.string()).optional(),
});

export const menuItemRouter = createCrudRouter({
  model: MenuItem,
  createSchema: menuItemSchema,
  roles: ["super_admin", "event_manager"],
  eventFilterField: "event",
});
