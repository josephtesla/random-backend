import {Request, Response, NextFunction} from "express"
import Team from "../models/teams";
import Fixture, {IFixture} from "../models/fixtures";
import {errorResponse, successResponse} from "../middlewares/responses";
import {ControllerResponse} from "../types";
import {isValidDate, isValidDbIdentifier} from "../utils/utils";
import {nanoid} from "nanoid";


export default class FixtureController {

  static async createFixture(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const {homeTeam: homeTeamId, awayTeam: awayTeamId, matchVenue, dateTime}: {
        homeTeam: string, awayTeam: string, matchVenue: string, dateTime: string
      } = req.body;


      if (!isValidDbIdentifier(homeTeamId))
        return errorResponse(res, 400, "homeTeam id parameter is invalid!", null);
      const homeTeamData = await Team.findOne({_id: homeTeamId});
      if (!homeTeamData)
        return errorResponse(res, 400, "team with the homeTeam id parameter does not exist!", null);

      if (!isValidDbIdentifier(awayTeamId))
        return errorResponse(res, 400, "awayTeam id parameter is invalid!", null);
      const awayTeamData = await Team.findOne({_id: awayTeamId});
      if (!awayTeamData)
        return errorResponse(res, 400, "team with the awayTeam id parameter does not exist!", null);

      if (homeTeamId === awayTeamId) {
        return errorResponse(res, 400, "cannot create a fixture for the same team!", null);
      }

      if (!isValidDate(dateTime)) {
        return errorResponse(res, 400, "Fixture date is invalid!", null);
      }

      const time = new Date(dateTime);
      const currentTime = new Date();
      if (time < currentTime)
        return errorResponse(res, 400, "Fixture date cannot be before now!", null);


      const data = await Fixture.create({
        homeTeam: homeTeamId,
        awayTeam: awayTeamId,
        matchVenue,
        dateTime: time.toISOString(),
        uniqueCode: nanoid(15)
      });

      const createdFixture: IFixture = await Fixture.findOne({_id: data._id})
        .populate("homeTeam").populate("awayTeam");

      return successResponse(res, 200, "Fixture created successfully", createdFixture);

    } catch (error) {
      next(error)
    }
  }


  static async fetchAllFixtrues(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const sizePerPage = Number(req.query.sizePerPage) || 15;
      const pageNumber = Number(req.query.pageNumber) || 1;

      const results = await Fixture.paginate({}, {
        limit: sizePerPage,
        page: pageNumber,
        sort: {date: -1},
        populate: "homeTeam awayTeam"
      });

      const data = {data: results.docs, ...results, docs: null};
      return successResponse(res, 200, "Fixtures fetched successfully", data);

    } catch (error) {
      next(error)
    }
  }

  static async fetchSingleFixture(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const fixtureId = req.params.fixtureId;
      if (!fixtureId) {
        return errorResponse(res, 400, "Fixture id parameter is invalid!", null);
      }

      let fixture: IFixture | null = null;
      if (isValidDbIdentifier(fixtureId)){
        fixture = await Fixture.findById(fixtureId)
          .populate("homeTeam awayTeam")
      }
      else {
        fixture = await Fixture.findOne({uniqueCode: fixtureId})
          .populate("homeTeam awayTeam")
      }

      if (!fixture) {
        return errorResponse(res, 400, "Fixture with the id or code does not exist!", null);
      }

      return successResponse(res, 200, "Fixture fetched successfully", fixture);
    } catch (error) {
      return next(error);
    }
  }

  static async removeSingleFixture(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const fixtureId = req.params.fixtureId;
      if (!fixtureId) {
        return errorResponse(res, 400, "Fixture id parameter is invalid!", null);
      }

      let fixture: IFixture | null = null;
      if (isValidDbIdentifier(fixtureId)){
        fixture = await Fixture.findById(fixtureId)
      }
      else {
        fixture = await Fixture.findOne({uniqueCode: fixtureId})
      }

      if (!fixture) {
        return errorResponse(res, 400, "Fixture with the id or code does not exist!", null);
      }

      if (isValidDbIdentifier(fixtureId)){
        await Fixture.deleteOne({_id: fixtureId});
        return successResponse(res, 200, "Fixture deleted successfully!", fixture);
      } else{
        await Fixture.deleteOne({uniqueCode: fixtureId});
        return successResponse(res, 200, "Fixture deleted successfully!", fixture);
      }

    } catch (error) {
      return next(error);
    }
  }

  static async updateSingleFixture(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const fixtureId = req.params.fixtureId;
      if (!fixtureId) {
        return errorResponse(res, 400, "Fixture id parameter is invalid!", null);
      }

      let fixture: IFixture | null = null;
      if (isValidDbIdentifier(fixtureId)){
        fixture = await Fixture.findById(fixtureId)
      }
      else {
        fixture = await Fixture.findOne({uniqueCode: fixtureId})
      }

      if (!fixture) {
        return errorResponse(res, 400, "Fixture with the id or code does not exist!", null);
      }

      const updates: { [k: string]: any } = {};
      ["matchVenue", "dateTime", "status"].forEach(key => {
        if (req.body[key]) {
          let value = req.body[key];
          if (key === "status" && !["pending", "completed"].includes(value)){
            return;
          }

          if (key === "dateTime" && !isValidDate(value)){
            return;
          }

          updates[key] = req.body[key];
        }
      })

      if (isValidDbIdentifier(fixtureId)){
        await Fixture.findByIdAndUpdate(fixtureId, updates);
        const updatedFixture: IFixture | null = await Fixture.findById(fixtureId);
        return successResponse(res, 200, "Fixtures updated successfully!", updatedFixture);
      } else {
        await Fixture.updateOne({uniqueCode: fixtureId}, updates);
        const updatedFixture: IFixture | null = await Fixture.findOne({uniqueCode: fixtureId});
        return successResponse(res, 200, "Fixtures updated successfully!", updatedFixture);
      }

    } catch (error) {
      return next(error);
    }
  }
}
