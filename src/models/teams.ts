import {PaginateModel, Document, Model, Schema, model} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


/**
 * Interface to model the Team schema
 * @param name:string
 * @param shortName:string
 * @param stadium:string
 * @param capacity:number
 */

export interface ITeam extends Document {
  name: string;
  shortName?: string;
  stadium?: string;
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  shortName: {
    type: String,
    unique: true
  },

  stadium: {
    type: String
  },

  capacity: {
    type: Number
  },


}, {
  timestamps: true
})

teamSchema.plugin(mongoosePaginate);

interface TeamModel<T extends Document> extends PaginateModel<T> {}
const Team: TeamModel<ITeam> = model<ITeam>("Team", teamSchema);

export default Team;
