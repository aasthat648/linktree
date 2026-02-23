import { Router } from "express";
import { getProfile, updateProfile } from "@/modules/profile/controllers";
import { authMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";

const router = Router();

router.get("/", authMiddleware, asyncHandler(getProfile));
router.put("/", authMiddleware, asyncHandler(updateProfile));

export default router;