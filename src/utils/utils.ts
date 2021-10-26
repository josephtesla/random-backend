import mongoose from "mongoose";

export const isValidDbIdentifier = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
}

// will use moment.js for better accuracy
export const isValidDate = (date: string): boolean => {
  const parsedDate = Date.parse(date);
  return !isNaN(parsedDate);
}
