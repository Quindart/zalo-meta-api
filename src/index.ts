import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

//TODO: IMPORT SOURCE
import routing from "./presentation/router/index.ts";
import config from "./config/index.ts";
import { blacklistMiddleware } from "./config/access-list.ts";
import SocketService from "./infrastructure/socket/connection/ConnectionSocketIO.ts";
import mongoService from "./infrastructure/mongo/connection/MongoService.ts";

import { ChannelService } from "./application/services/channel/Channel.service.ts";
import { MongooseChannelRepository } from "./infrastructure/mongo/repositories/MongooseChannelRepository.ts";
import { ChannelMapper } from "./infrastructure/mongo/mappers/ChannelMapper.ts";
import { removeUndefined } from "./utils/query.ts";
import { container } from "./infrastructure/inversify/container.ts";
import TYPES from "./infrastructure/inversify/type.ts";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);


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
async function runningService() {
  //TODO: Start
  server.listen(config.port, () => {
    console.log(`✅> Server is running at http://localhost:${config.port}`);
  });

  //TODO: socket
  const appSocket = new SocketService(server);
  appSocket.start()

  //TODO: MongoDB
  mongoService.connect();


  const channelService = container.get<ChannelService>(TYPES.ChannelService);

  (async () => {
    const channel = await channelService.findOne("680fa42fe0082d9684f2a350", "name");
    console.log("💲💲💲 ~ channel:", removeUndefined(channel))
  })();

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
