import { authMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";
import { Router } from "express";
import { getTheme, updateTheme } from "@/modules/theme/controllers";

const router = Router();

router.put("/", authMiddleware, asyncHandler(updateTheme));
router.get("/", authMiddleware, asyncHandler(getTheme));

export default router;
