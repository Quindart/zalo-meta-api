const zaloService = require("./src");
const os = require("os");
const chalk = require("chalk");

const totalMemory = (os.totalmem() / 1024 ** 3).toFixed(2);
const freeMemory = (os.freemem() / 1024 ** 3).toFixed(2);

console.log(chalk.grey("🚀 OS RAM Configuration:"));
console.log(chalk.blueBright(`- Total Memory:::: ${totalMemory} GB`));
console.log(chalk.blueBright(`- Free Memory::::: ${freeMemory} GB`));
