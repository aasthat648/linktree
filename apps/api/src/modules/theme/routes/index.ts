import { authMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";
import { Router } from "express";
import { updateTheme } from "../controllers";

const router = Router();

router.put("/", authMiddleware, asyncHandler(updateTheme));

export default router;
