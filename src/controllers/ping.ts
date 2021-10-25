import { Request, Response, NextFunction } from "express"

export default class PingController {
    public static async getMessage(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return res.status(200).json({
            "message": "Fine it works super!"
        })
    }
}
