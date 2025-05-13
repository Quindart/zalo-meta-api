"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const chalk_1 = __importDefault(require("chalk"));
const client_1 = __importDefault(require("./client"));
const index_1 = __importDefault(require("./index"));
const totalMemory = (os_1.default.totalmem() / 1024 ** 3).toFixed(2);
const freeMemory = (os_1.default.freemem() / 1024 ** 3).toFixed(2);
class Server {
    constructor(zaloService) {
        this.zaloService = zaloService;
        console.log(chalk_1.default.grey("🚀 OS RAM Configuration:"));
        console.log(chalk_1.default.blueBright(`- Total Memory:::: ${totalMemory} GB`));
        console.log(chalk_1.default.blueBright(`- Free Memory::::: ${freeMemory} GB`));
    }
}
new Server(index_1.default);
const clients = [
    { port: 3004, name: "Admin" },
];
clients.forEach((item) => new client_1.default(item.port, item.name).onInit());
