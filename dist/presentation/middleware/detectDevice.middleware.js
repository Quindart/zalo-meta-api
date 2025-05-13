"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDevice = void 0;
const useragent_1 = __importDefault(require("useragent"));
const detectDevice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = useragent_1.default.parse(req.headers["user-agent"]);
        req.deviceInfo = {
            device: agent.device.toString(),
            os: agent.os.toString(),
            browser: agent.toAgent(),
            ip: req.ip,
            language: req.headers["accept-language"],
        };
        next();
    }
    catch (error) {
        console.log("💲💲💲 ~ detectDevice ~ error:", error);
    }
});
exports.detectDevice = detectDevice;
