import path from "path";
import os from "os";
import express, { Express } from "express";
import http, { Server } from "http";
import { exec } from "child_process";


class Client {
  private client: Express;
  private serverClient: Server;
  private port: number;
  private userName: string;
  private localIP: string;

  constructor(port: number, userName: string) {
    this.port = port;
    this.userName = userName;
    this.localIP = this.getLocalIP();
  }

  private getLocalIP(): string {
    try {
      const interfaces = os.networkInterfaces();
      for (const [name, iface] of Object.entries(interfaces)) {
        if (!iface) continue;
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
      const command = `netsh advfirewall firewall add rule name="Node.js Server ${this.port}" dir=in action=allow protocol=TCP localport=${this.port}`;
      exec(command, (error, stdout, stderr) => {
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

  public onInit(): void {
    this.client = express();
    this.client.set("view engine", "ejs");
    this.client.set("views", path.join(__dirname, "public"));

    this.serverClient = http.createServer(this.client);

    this.client.get("/view", (req, res) => {
      res.render("chat", {
        port: this.port,
        userName: this.userName,
        localIP: this.localIP,
      });
    });

    this.serverClient.listen(this.port, this.localIP, () => {
      console.log(
        `Truy cập client LAN: http://${this.localIP}:${this.port}/view`
      );
    });
  }
}

export default Client;