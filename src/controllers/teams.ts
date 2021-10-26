import { Request, Response, NextFunction } from "express"
import Team, { ITeam } from "../models/teams";
import {errorResponse, successResponse} from "../middlewares/responses";
import { ControllerResponse } from "../types";
import { isValidDbIdentifier } from "../utils/utils";
import Fixture from "../models/fixtures";

export default class TeamsController {

  static async createTeam(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const {name, shortName, stadium, capacity}: ITeam = req.body;
      const createdTeam: ITeam = await Team.create({name, shortName, stadium, capacity});
      return successResponse(res, 200, "team created successfully", createdTeam);

    } catch (error) {
      next(error)
    }
  }


  static async fetchAllTeams(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const sizePerPage = Number(req.query.sizePerPage) || 15;
      const pageNumber = Number(req.query.pageNumber) || 1;

      const results = await Team.paginate({}, {limit: sizePerPage, page: pageNumber});

      const data = {data: results.docs, ...results, docs: null};
      return successResponse(res, 200, "teams fetched successfully", data);

    } catch (error) {
      next(error)
    }
  }

  static async fetchSingleTeam(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const teamId = req.params.teamId;
      if (!teamId || !isValidDbIdentifier(teamId)) {
        return errorResponse(res, 400, "Team id parameter is invalid!", null);
      }

      const team: ITeam | null = await Team.findOne({_id: teamId});

      if (!team) {
        return errorResponse(res, 400, "Team with the id does not exist!", null);
      }

      return successResponse(res, 200, "Team fetched successfully", team);
    } catch (error) {
      return next(error);
    }
  }

  static async removeSingleTeam(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const teamId = req.params.teamId;
      if (!teamId || !isValidDbIdentifier(teamId)) {
        return errorResponse(res, 400, "Team id parameter is invalid!", null);
      }

      const team: ITeam | null = await Team.findOne({_id: teamId});

      if (!team) {
        return errorResponse(res, 400, "Team with the id does not exist!", null);
      }

      await Team.deleteOne({_id: teamId});
      await Fixture.deleteMany().or([{ homeTeam: teamId }, { awayTeam: teamId }]);

      return successResponse(res, 200, "Team deleted successfully!", team);
    } catch (error) {
      return next(error);
    }
  }

  static async updateSingleTeam(req: Request, res: Response, next: NextFunction): Promise<ControllerResponse> {
    try {
      const teamId = req.params.teamId;
      if (!teamId || !isValidDbIdentifier(teamId)) {
        return errorResponse(res, 400, "Team id parameter is invalid!", null);
      }

      const team: ITeam | null = await Team.findOne({_id: teamId});

      if (!team) {
        return errorResponse(res, 400, "Team with the id does not exist!", null);
      }

      const updates: {[k: string]: any} = {};
      ["name", "shortName", "stadium", "capacity"].forEach(key => {
        if (req.body[key]){
          updates[key] = req.body[key];
        }
      })

      await Team.findByIdAndUpdate(teamId, updates);
      const updatedTeam: ITeam | null = await Team.findById(teamId);

      return successResponse(res, 200, "Team updated successfully!", updatedTeam);
    } catch (error) {
      return next(error);
    }
  }
}


