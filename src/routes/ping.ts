import express, {Router} from "express";
import PingController from "../controllers/ping";

const router: Router = express.Router();

router.get("/", PingController.getMessage);

export default router
