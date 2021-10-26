import mongoose from "mongoose";
import logger from './logger';

require('dotenv').config();

const environment = String(process.env.NODE_ENV).trim();
const mongoURI: string = environment === "development" ?
  String(process.env.MONGO_URI_DEV) : environment === "test" ?
    String(process.env.MONGO_URI_TEST) : String(process.env.MONGO_URI_PROD);


class MongooseLoader {
  static connectMongoose = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log(`
     ################################################
      🛡️  Mongo Database Connected! 🛡️
       ${mongoURI}, ${environment} 
      ################################################
  `);

    } catch (err) {
      logger.error('DB Connection not successful!', err);
      //process.exit(1);
    }
  };
}

export default MongooseLoader;
