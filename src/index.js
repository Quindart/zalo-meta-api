import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import routing from "./application/router/index.js";
import config from "../config/index.js";
import socketService from "./infrastructure/socket/connection/ConnectionSocketIO.js";
import http from "http";
import redisService from "./infrastructure/redis/RedisService.js";
import mongoService from "./infrastructure/mongo/connection/MongoService.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);

import { blacklistMiddleware, whitelistMiddleware } from '../config/access-list.js';
import onSocketControllerTesting from "./demo.socket.io.js";
import QRService from "./infrastructure/QR/index.js";

express.static(".");

const service_info = config.services.zalo;

//TODO: Access list
app.use(blacklistMiddleware);

//TODO: middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"))


//TODO: Routing service
routing(app);
function runningService() {
  //TODO: Start
  server.listen(config.port, () => {
    console.log(`✅> Server is running at http://localhost:${config.port}`);
    console.log(
      chalk.bgGray(
        `✅> Swagger is running at http://localhost:${config.port}/api/v1/swagger`
      )
    );
  });

  //TODO: socket
  const appSocket = new socketService(server);
  //  onSocketControllerTesting(app,appSocket)
  appSocket.start()

  //TODO: Redis
  redisService.connect();

  //TODO: MongoDB
  mongoService.connect();

  //TODO: LOG
  console.log(chalk.grey("🚀 Service Info"));
  console.log(
    chalk.blueBright(`> Name:::::::: ${service_info.name || "Unknown"}`)
  );
  console.log(
    chalk.blueBright(`> Version::::: ${service_info.version || "1.0.0"}`)
  );
}

runningService();



export default app;
