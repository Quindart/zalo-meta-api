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
const eventEnum_1 = __importDefault(require("../../../constants/eventEnum"));
class QRSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.registerEvents();
    }
    registerEvents() {
        this.socket.on(eventEnum_1.default.QR.ACCEPTED_LOGIN, this.acceptedLogin.bind(this));
        this.socket.on(eventEnum_1.default.QR.VERIFY, this.verify.bind(this));
    }
    verify(detectInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.io.emit(eventEnum_1.default.QR.VERIFY, detectInfo);
        });
    }
    acceptedLogin(loginQR) {
        return __awaiter(this, void 0, void 0, function* () {
            this.io.emit(eventEnum_1.default.QR.ACCEPTED_LOGIN, loginQR);
        });
    }
}
exports.default = QRSocket;
