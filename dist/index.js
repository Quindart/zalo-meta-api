"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const chalk_1 = __importDefault(require("chalk"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
//TODO: IMPORT SOURCE
const index_1 = __importDefault(require("./presentation/router/index"));
const index_2 = __importDefault(require("./config/index"));
const access_list_1 = require("./config/access-list");
const ConnectionSocketIO_1 = __importDefault(require("./infrastructure/socket/connection/ConnectionSocketIO"));
const MongoService_1 = __importDefault(require("./infrastructure/mongo/connection/MongoService"));
const query_1 = require("./utils/query");
const container_1 = require("./infrastructure/inversify/container");
const type_1 = __importDefault(require("./infrastructure/inversify/type"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
express_1.default.static(".");
const service_info = index_2.default.services.zalo;
//TODO: Access list
app.use(access_list_1.blacklistMiddleware);
//TODO: middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "./views"));
//TODO: Routing service
(0, index_1.default)(app);
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO: Start
        server.listen(index_2.default.port, () => {
            console.log(`✅> Server is running at http://localhost:${index_2.default.port}`);
        });
        //TODO: socket
        const appSocket = new ConnectionSocketIO_1.default(server);
        appSocket.start();
        //TODO: MongoDB
        MongoService_1.default.connect();
        const channelService = container_1.container.get(type_1.default.ChannelService);
        (() => __awaiter(this, void 0, void 0, function* () {
            const channel = yield channelService.findOne("680fa42fe0082d9684f2a350", "name");
            console.log("💲💲💲 ~ channel:", (0, query_1.removeUndefined)(channel));
        }))();
        //TODO: LOG
        console.log(chalk_1.default.grey("🚀 Service Info"));
        console.log(chalk_1.default.blueBright(`> Name:::::::: ${service_info.name || "Unknown"}`));
        console.log(chalk_1.default.blueBright(`> Version::::: ${service_info.version || "1.0.0"}`));
    });
}
bootstrap();
exports.default = app;
