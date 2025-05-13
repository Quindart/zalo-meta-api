import os from "os";
import chalk from "chalk";
import Client from "./client";
import zaloService from "./index"
const totalMemory: string = (os.totalmem() / 1024 ** 3).toFixed(2);
const freeMemory: string = (os.freemem() / 1024 ** 3).toFixed(2);

class Server {
  public zaloService: any;
  constructor(zaloService: any) {
    this.zaloService = zaloService;
    console.log(chalk.grey("🚀 OS RAM Configuration:"));
    console.log(chalk.blueBright(`- Total Memory:::: ${totalMemory} GB`));
    console.log(chalk.blueBright(`- Free Memory::::: ${freeMemory} GB`));
  }
}

new Server(zaloService);

// TODO: Testing client
interface ClientInfo {
  port: number;
  name: string;
}

const clients: ClientInfo[] = [
  { port: 3004, name: "Admin" },
];

clients.forEach((item) => new Client(item.port, item.name).onInit());
