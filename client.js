import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import express from "express";
import http from "http";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Client {
  client;
  serverClient;
  port;
  userName;
  localIP;

  constructor(port, userName) {
    this.port = port;
    this.userName = userName;
    this.localIP = this.getLocalIP();
  }

  getLocalIP() {
    try {
      const interfaces = os.networkInterfaces();
      for (const [name, iface] of Object.entries(interfaces)) {
        for (const info of iface) {
          if (
            info.family === "IPv4" &&
            !info.internal &&
            !name.includes("WSL")
          ) {
            return info.address;
          }
        }
      }
      return "127.0.0.1";
    } catch (error) {
      const command = `netsh advfirewall firewall add rule name="Node.js Server ${port}" dir=in action=allow protocol=TCP localport=${port}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("Fail LAN:", error.message);
          return;
        }
        if (stderr) {
          console.warn("Warning:", stderr);
          return;
        }
        console.log(`✅LAN port ${port}`);
      });
    }
  }

  onInit() {
    this.client = express();
    this.client.set("view engine", "ejs");
    this.client.set("views", path.join(__dirname, "public"));

    this.serverClient = http.createServer(this.client);

    this.client.get("/view", (req, res) => {
      res.render("chat", { port: this.port, userName: this.userName });
    });

    this.serverClient.listen(this.port, "0.0.0.0", () => {
      console.log(
        `$Truy cập client LAN:`,
        `http://${this.localIP}:${this.port}/view`
      );
    });
  }
}

export default Client;
