import {PaginateModel, Document, Model, Schema, model} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {ITeam} from "./teams";
import {string} from "joi";

/**
 * Interface to model the Fixture schema
 * @param homeTeam: MongoDB Object ID
 * @param awayTeam: MongoDB Object ID
 * @param matchStadium:string
 * @param dateTime: Date
 * @param status: pending | completed
 */

export interface IFixture extends Document {
  homeTeam: Schema.Types.ObjectId | string;
  awayTeam: Schema.Types.ObjectId | string;
  matchVenue: string;
  dateTime?: Date | string;
  status?: "pending" | "completed";
  uniqueCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const fixtureSchema: Schema = new Schema({
  homeTeam: {
    type: Schema.Types.ObjectId,
    "ref": "Team",
    required: true,
  },

  awayTeam: {
    type: Schema.Types.ObjectId,
    "ref": "Team",
    required: true,
  },

  matchVenue: {
    type: String,
  },

  dateTime: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    default: "pending"
  },

  uniqueCode: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
})

fixtureSchema.plugin(mongoosePaginate);

interface FixtureModel<T extends Document> extends PaginateModel<T> {}
const Fixture: FixtureModel<IFixture> = model<IFixture>("Fixture", fixtureSchema);

export default Fixture;
