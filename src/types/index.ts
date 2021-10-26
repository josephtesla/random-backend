import { Response } from "express";

export enum Roles {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  USER = "user"
}

export type ControllerResponse = Response<any, Record<any, any>> | void;

