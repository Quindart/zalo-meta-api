require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const chalk = require("chalk");
const app = express();

const config = require("../config/index");
const service_info = config.services.zalo;

//TODO: middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function runningService() {
  //TODO: Start
  app.listen(config.port, () =>
    console.log(
      chalk.bgGray(`🚀> App is running at http://localhost:${config.port}`)
    )
  );
  console.log(chalk.grey("🚀 Service Info"));
  console.log(
    chalk.blueBright(`> Name:::::::: ${service_info.name || "Unknown"}`)
  );
  console.log(
    chalk.blueBright(`> Version::::: ${service_info.version || "1.0.0"}`)
  );
}

runningService();
module.exports = app;
