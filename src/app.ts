import express, {Response, Request, NextFunction, Application} from "express";
import morgan from "morgan";
import mongooseLoader from "./loaders/mongoose"
import cookieParser from "cookie-parser";
import cors from "cors";
import AppError from "./errors/AppError";
import errorHandler from "./errors/errorHandler";
import routes from "./routes";


const app: Application = express();

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

app.use(morgan("tiny"));
app.use(express.static("public"))

//Mongoose Connection
mongooseLoader.connectMongoose().then(() => console.log("mongoose loaded!"));

//Seed DB
//seedDatabase();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

//API Endpoints Routes
app.use('/api/v1', routes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `This endpoint ${req.originalUrl} does not exist on this server!`,
      404
    )
  );
});

app.use(errorHandler);

export default app;

