"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const friend_controller_1 = __importDefault(require("../handlers/friend.controller"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const router = express_1.default.Router();
router.post(Routes_1.default.FRIEND_REQUEST_LIST, friend_controller_1.default.getFriendList);
router.put(Routes_1.default.INDEX, authentication_middleware_1.authenticateToken, friend_controller_1.default.accpetFriend);
//TODO MY FRIEND
router.get(Routes_1.default.INDEX, authentication_middleware_1.authenticateToken, friend_controller_1.default.getMyFriends);
router.get(Routes_1.default.INDEX, authentication_middleware_1.authenticateToken, friend_controller_1.default.removeFriend);
//TODO ACCEPT FRIEND
router.delete(Routes_1.default.INDEX, authentication_middleware_1.authenticateToken, friend_controller_1.default.rejectAcceptFriend);
//TODO: INVITE FRIEND
router.get(Routes_1.default.MY_INVITE_FRIENDS_REQUEST, authentication_middleware_1.authenticateToken, friend_controller_1.default.getMyInviteFriends);
router.get(Routes_1.default.MY_INVITED_SENDING_REQUEST, authentication_middleware_1.authenticateToken, friend_controller_1.default.getMyInvitedSending);
router.post(Routes_1.default.ALL_INVITED_REQUEST, authentication_middleware_1.authenticateToken, friend_controller_1.default.inviteFriend);
router.post(Routes_1.default.MY_INVITE_FRIENDS_REQUEST, authentication_middleware_1.authenticateToken, friend_controller_1.default.inviteFriend);
router.delete(Routes_1.default.MY_INVITE_FRIENDS_REQUEST, authentication_middleware_1.authenticateToken, friend_controller_1.default.removeIniviteFriend);
exports.default = router;
