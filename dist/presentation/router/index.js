"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_router_1 = __importDefault(require("./user.router"));
const authen_router_1 = __importDefault(require("./authen.router"));
const swagger_router_1 = __importDefault(require("./swagger.router"));
const mail_router_1 = __importDefault(require("./mail.router"));
const channel_router_1 = __importDefault(require("./channel.router"));
const friend_router_1 = __importDefault(require("./friend.router"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const message_router_1 = __importDefault(require("./message.router"));
const me_router_1 = __importDefault(require("./me.router"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
function routing(app) {
    // app.use(imageUpload);
    app.use(Routes_1.default.AUTHEN, authen_router_1.default);
    app.use(Routes_1.default.USER, user_router_1.default);
    app.use(Routes_1.default.CHANNEL, authentication_middleware_1.authenticateToken, channel_router_1.default);
    app.use(Routes_1.default.MAIL, mail_router_1.default);
    app.use(swagger_router_1.default);
    app.use(Routes_1.default.MESSAGE, authentication_middleware_1.authenticateToken, message_router_1.default);
    app.use(Routes_1.default.ME, me_router_1.default);
    app.use(Routes_1.default.FRIEND, authentication_middleware_1.authenticateToken, friend_router_1.default);
}
exports.default = routing;
