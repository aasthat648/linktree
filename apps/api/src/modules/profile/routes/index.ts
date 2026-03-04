import { Router } from "express";
import { changeUsername, getProfile, updateProfile } from "@/modules/profile/controllers";
import { authMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";

const router = Router();

router.get("/", authMiddleware, asyncHandler(getProfile));
router.patch("/", authMiddleware, asyncHandler(updateProfile));
router.patch("/change-username", authMiddleware, asyncHandler(changeUsername));

export default router;