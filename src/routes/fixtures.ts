import express, {Router} from "express";
import FixtureController from "../controllers/fixtures";
import {requireRoles, requireSignIn} from "../middlewares/auth";
import {Roles} from "../types";

const router: Router = express.Router();


// search endpoint

router.use(requireSignIn);
router.get("/", FixtureController.fetchAllFixtrues);
router.get("/:fixtureId", FixtureController.fetchSingleFixture);

router.post("/", requireRoles([Roles.ADMIN]), FixtureController.createFixture);
router.put("/:fixtureId", requireRoles([Roles.ADMIN]), FixtureController.updateSingleFixture);
router.delete("/:fixtureId", requireRoles([Roles.ADMIN]), FixtureController.removeSingleFixture);

export default router;
