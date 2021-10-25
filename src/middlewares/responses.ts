import { Response } from "express"

export const successResponse = (res: Response, statusCode: number, message: string, data: any) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

export const errorResponse = (res: Response, statusCode: number, message: string, error: any) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        error,
    });
};
