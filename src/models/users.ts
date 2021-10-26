import {Document, Model, Schema, model} from "mongoose";
import { Roles } from "../types";

/**
 * Interface to model the User schema
 * @param name:string
 * @param username:string
 * @param password:string
 * @param role: Roles
 */
export interface IUser extends Document {
    name: string;
    username: string;
    password: string;
    role: Roles
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        required: true,
        default: Roles.USER
    }

}, {
    timestamps: true
})

const User: Model<IUser> = model("User", userSchema);

export default User;
