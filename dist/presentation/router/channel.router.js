"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const channel_controller_1 = __importDefault(require("../handlers/channel.controller"));
const router = express_1.default.Router();
router.post(Routes_1.default.INDEX, channel_controller_1.default.createGroup);
router.put(Routes_1.default.ASSIGN_ROLE, channel_controller_1.default.assignRoleMember);
router.put(Routes_1.default.OUT_CHANNEL, channel_controller_1.default.outChannel);
router.post(Routes_1.default.MEMBER, channel_controller_1.default.addMemberToChannel);
router.get(Routes_1.default.MEMBER, channel_controller_1.default.getAllMember);
router.get(Routes_1.default.INDEX, channel_controller_1.default.getAllChannel);
router.get(Routes_1.default.BY_ID, channel_controller_1.default.getChannelByID);
exports.default = router;
