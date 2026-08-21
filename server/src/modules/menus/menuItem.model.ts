import { Schema, model } from "mongoose";

const menuItemSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    category: {
      type: String,
      enum: ["welcome_drink", "starters", "main_course", "rice", "dal", "curries", "bread", "desserts", "beverages"],
      required: true,
    },
    name: { type: String, required: true },
    dietary: { type: String, enum: ["vegetarian", "non_vegetarian", "vegan", "jain"], required: true },
    allergens: [{ type: String }],
  },
  { timestamps: true }
);

export const MenuItem = model("MenuItem", menuItemSchema);
