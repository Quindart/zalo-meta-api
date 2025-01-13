import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import routing from "./application/router/index.js";
import config from "../config/index.js";

const app = express();

express.static(".");

const service_info = config.services.zalo;

//TODO: middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//TODO: Routing service
routing(app);

function runningService() {
  //TODO: Start
  app.listen(config.port, () => {
    console.log(
      chalk.bgGray(`🚀> Server is running at http://localhost:${config.port}`)
    );
    console.log(
      chalk.bgGray(
        `🚀> Swagger is running at http://localhost:${config.port}/api/v1/swagger`
      )
    );
  });
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
