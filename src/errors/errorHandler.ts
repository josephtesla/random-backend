import { Response, Request, NextFunction } from "express";
import { errorResponse } from '../middlewares/responses';
import AppError from './AppError';

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 403);
};

const handleJWTExpiredError = () => {
   return new AppError('Your token has expired! Please log in again.', 401);
};

const sendErrorDev = (err: any, req: Request, res: Response) => {
    return errorResponse(res, err.statusCode, err.message, err.stack);
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
    if (err.isOperational) {
        return errorResponse(res, err.statusCode, err.message, null);
    }

    // 2) Send generic message
    return errorResponse(
        res,
        500,
        'Oops, Something went wrong, Please try again',
        null
    );
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'test'
    ) {
        let error = err;
        error.message = err.message;
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};
