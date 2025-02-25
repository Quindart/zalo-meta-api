import zaloService from "./src/index.js";
import os from "os";
import chalk from "chalk";
import Client from "./client.js";
import User from "./src/infrastructure/mongo/model/User.js";
import { faker } from "@faker-js/faker";

const totalMemory = (os.totalmem() / 1024 ** 3).toFixed(2);
const freeMemory = (os.freemem() / 1024 ** 3).toFixed(2);

class Server {
  zaloService;
  constructor(zaloService) {
    this.zaloService = zaloService;
    console.log(chalk.grey("🚀 OS RAM Configuration:"));
    console.log(chalk.blueBright(`- Total Memory:::: ${totalMemory} GB`));
    console.log(chalk.blueBright(`- Free Memory::::: ${freeMemory} GB`));
  }
}

const serverMeta = new Server(zaloService);

//TODO: Testing client
[
  { port: 3000, name: "Quang" },
  { port: 3001, name: "Phong" },
  { port: 3002, name: "Tuyen" },
  { port: 3003, name: "Huy" },
  { port: 3004, name: "Hieu" },
].forEach((item) => new Client(item.port, item.name).onInit());

