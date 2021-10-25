import express, {Router} from "express";
import pingRoutes from "./ping";

const router: Router = express.Router();

router.use("/ping", pingRoutes);

export default router;
