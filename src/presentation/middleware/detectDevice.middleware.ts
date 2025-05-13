import { NextFunction, Request, Response } from "express";
import useragent from "useragent";
import { RequestQR } from "../../types/request/RequestQR";

export const detectDevice = async (req: RequestQR, res: Response, next: NextFunction) => {
    try {
        const agent = useragent.parse(req.headers["user-agent"]);

        req.deviceInfo = {
            device: agent.device.toString(),
            os: agent.os.toString(),
            browser: agent.toAgent(),
            ip: req.ip,
            language: req.headers["accept-language"],
        };
        next();
    } catch (error) {
        console.log("💲💲💲 ~ detectDevice ~ error:", error)
    }
}