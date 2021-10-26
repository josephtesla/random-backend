import express, {Router} from "express";
import teamsRoutes from "./teams";
import fixturesRoutes from "./fixtures";
import authRoutes from "./auth";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/teams", teamsRoutes);
router.use("/fixtures", fixturesRoutes);

export default router;
