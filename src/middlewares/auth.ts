import {Request, Response, NextFunction} from "express";
import {ControllerResponse, Roles} from "../types";
import jwt from "jsonwebtoken";
import {errorResponse} from "./responses";
import User, { IUser } from "../models/users";

export const requireSignIn = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.body.token || req.headers["authorization"];
  if (!token) {
    return errorResponse(res, 403, "No access token provided. auth failed", null);
  }

  jwt.verify(token, `${ process.env.JWT_SECRET}`, (err, decoded) => {
    if (err) {
      return errorResponse(res, 401, "Invalid token. pls sign in again.", null);
    }

    req.userId = decoded?.id;
    return next();
  })
}

export const requireRoles = (roles: Roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const account: IUser | null = await User.findOne({_id: req.userId});
    if (account && roles.includes(account.role)){
      return next();
    }
    return errorResponse(res, 401, "user not authorized to access!", null)
  }
}
