import { Router } from 'express';
import authRoutes from "@/modules/auth/routes"
import linkRoutes from "@/modules/link/routes";
import profileRoutes from "@/modules/profile/routes";
import themeRoutes from "@/modules/theme/routes";

const router: Router = Router();

router.use("/auth", authRoutes)
router.use("/link", linkRoutes)
router.use("/profile", profileRoutes)
router.use("/theme", themeRoutes)

export default router;
