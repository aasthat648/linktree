import { Router } from "express";
import { incrementClickController } from "../controllers";
import { asyncHandler } from "@/utils";

const router = Router();

router.post("/increment", asyncHandler(incrementClickController));

export default router;
