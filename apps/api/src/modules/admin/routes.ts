import { Router } from "express";
import authRoutes from "./auth/routes";
import analyticsRoutes from "./analytics/routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
