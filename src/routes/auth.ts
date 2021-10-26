import express, {Router} from "express";
import AuthController from "../controllers/auth";

const router: Router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.signIn);

export default router;
