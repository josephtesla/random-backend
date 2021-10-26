import {Request, Response, NextFunction} from "express";
import {ControllerResponse, Roles} from "../types";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/users";
import {errorResponse, successResponse} from "../middlewares/responses";

export default class AuthController {
  static async signUp(req:Request, res:Response, next:NextFunction) :Promise<ControllerResponse> {
   try {
     const { name, username, password } = req.body;
     const user: IUser | null = await User.findOne({ username });
     if (user)
       return errorResponse(res, 400, "Username is already taken!", null);

     const hashedPassword = bcrypt.hashSync(password, 10);
     const createdUser: IUser = await User.create({
       name,
       username,
       password: hashedPassword,
       role: Roles.USER
     })

     const token = jwt.sign({ id: createdUser._id  },
       `${process.env.JWT_SECRET}`,
       { expiresIn: "24h"});

     createdUser.password = "";
     return successResponse(res, 200, "user signup successful!", {
       user: createdUser,
       accessToken: token
     });

   } catch (error){
     return next(error)
   }
  }


  static async signIn(req:Request, res:Response, next:NextFunction) :Promise<ControllerResponse> {
    try {
      const { username, password } = req.body;
      const user: IUser | null = await User.findOne({ username });
      if (!user)
        return errorResponse(res, 400, "Username does not exist!", null);

      if (!bcrypt.compareSync(`${password}`, user.password)) {
        return errorResponse(res, 400, "Username or password incorrect!", null);
      }

      const token = jwt.sign({  id: user._id },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "10m"});

      user.password = "";
      return successResponse(res, 200, "user sign in successful!", {
        user,
        accessToken: token
      });

    } catch (error){
      return next(error)
    }
  }

}
