import { Router } from "express";
import { changeUsername, getProfile, updateProfile } from "@/modules/profile/controllers";
import { authMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";

const router = Router();

router.get("/", authMiddleware, asyncHandler(getProfile));
router.put("/", authMiddleware, asyncHandler(updateProfile));
router.put("/change-username", authMiddleware, asyncHandler(changeUsername));

export default router;