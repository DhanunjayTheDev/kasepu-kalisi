import { Router } from "express";
import { z } from "zod";
import { User } from "./user.model";
import { requireUser, requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { ApiError } from "../../middleware/error-handler";

export const userRouter = Router();

userRouter.get("/me", requireUser, async (req, res) => {
  const user = await User.findById(req.auth!.sub);
  if (!user) throw new ApiError(404, "User not found");
  res.json({ user });
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  age: z.number().min(1).max(120).optional(),
  city: z.string().min(1).optional(),
});

userRouter.patch("/me", requireUser, validateBody(updateProfileSchema), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.auth!.sub, req.body, { returnDocument: "after" });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ user });
});

userRouter.delete("/me", requireUser, async (req, res) => {
  await User.findByIdAndDelete(req.auth!.sub);
  res.status(204).send();
});

// Admin: list attendees
userRouter.get("/", requireAdmin(), async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const [users, total] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(),
  ]);

  res.json({ users, pagination: { page, limit, total } });
});
