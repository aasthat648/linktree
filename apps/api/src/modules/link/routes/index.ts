import { Router } from "express";
import { createLink, deleteLink, getLinks, updateLink } from "../controllers";
import { authMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";

const router = Router();

router.post("/", authMiddleware, asyncHandler(createLink));
router.get("/", authMiddleware, asyncHandler(getLinks));
router.put("/:id", authMiddleware, asyncHandler(updateLink));
router.delete("/:id", authMiddleware, asyncHandler(deleteLink));

export default router;