"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const message_controller_1 = __importDefault(require("../handlers/message.controller"));
const router = express_1.default.Router();
router.get(Routes_1.default.MESSAGE_BY_RECEIVERID_SENDERID, message_controller_1.default.getMessages);
router.get(Routes_1.default.BY_ID, message_controller_1.default.getMessageById);
exports.default = router;
