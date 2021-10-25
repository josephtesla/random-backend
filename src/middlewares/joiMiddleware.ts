import AppError from '../errors/AppError';
import { Response, Request, NextFunction } from "express";
import { Schema } from "joi";

const middleware = (schema: Schema, property: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        const valid = error == null;

        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map((i: any) => i.message).join(',');
            console.log('message ', message);
            next(new AppError(message, 400));
        }
    };
};

export default middleware;
