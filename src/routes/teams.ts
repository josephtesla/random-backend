import express, {Router} from "express";
import TeamsController from "../controllers/teams";
import {requireRoles, requireSignIn} from "../middlewares/auth";
import {Roles} from "../types";

const router: Router = express.Router();

router.use(requireSignIn);

router.get("/",  TeamsController.fetchAllTeams);
router.get("/:teamId", TeamsController.fetchSingleTeam);

router.post("/", requireRoles([Roles.ADMIN]), TeamsController.createTeam);
router.put("/:teamId", requireRoles([Roles.ADMIN]), TeamsController.updateSingleTeam);
router.delete("/:teamId", requireRoles([Roles.ADMIN]), TeamsController.removeSingleTeam);

export default router;
