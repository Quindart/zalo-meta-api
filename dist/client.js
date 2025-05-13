"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const child_process_1 = require("child_process");
class Client {
    constructor(port, userName) {
        this.port = port;
        this.userName = userName;
        this.localIP = this.getLocalIP();
    }
    getLocalIP() {
        try {
            const interfaces = os_1.default.networkInterfaces();
            for (const [name, iface] of Object.entries(interfaces)) {
                if (!iface)
                    continue;
                for (const info of iface) {
                    if (info.family === "IPv4" &&
                        !info.internal &&
                        !name.includes("WSL")) {
                        return info.address;
                    }
                }
            }
            return "127.0.0.1";
        }
        catch (error) {
            const command = `netsh advfirewall firewall add rule name="Node.js Server ${this.port}" dir=in action=allow protocol=TCP localport=${this.port}`;
            (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("Fail LAN:", error.message);
                    return;
                }
                if (stderr) {
                    console.warn("Warning:", stderr);
                    return;
                }
                console.log(`✅LAN port ${this.port}`);
            });
            return "127.0.0.1";
        }
    }
    onInit() {
        this.client = (0, express_1.default)();
        this.client.set("view engine", "ejs");
        this.client.set("views", path_1.default.join(__dirname, "public"));
        this.serverClient = http_1.default.createServer(this.client);
        this.client.get("/view", (req, res) => {
            res.render("chat", {
                port: this.port,
                userName: this.userName,
                localIP: this.localIP,
            });
        });
        this.serverClient.listen(this.port, this.localIP, () => {
            console.log(`Truy cập client LAN: http://${this.localIP}:${this.port}/view`);
        });
    }
}
exports.default = Client;
