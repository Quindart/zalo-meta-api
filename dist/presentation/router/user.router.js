"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const user_controller_1 = __importDefault(require("../handlers/user.controller"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const router = express_1.default.Router();
//TODO [GET]
router.get(Routes_1.default.INDEX, user_controller_1.default.getUsers);
router.get(Routes_1.default.SEARCH, user_controller_1.default.searchUsers);
router.get(Routes_1.default.SEARCH_FRIEND, authentication_middleware_1.authenticateToken, user_controller_1.default.searchUserWithFriends);
router.get(Routes_1.default.BY_ID, user_controller_1.default.getUserById);
router.get(Routes_1.default.BY_PHONE, user_controller_1.default.getUserByPhone);
//TODO [POST]
router.post(Routes_1.default.INDEX, user_controller_1.default.createUser);
router.put(Routes_1.default.BY_ID, user_controller_1.default.updateUser);
//TODO [DELETE]
router.delete(Routes_1.default.BY_ID, user_controller_1.default.deleteUser);
exports.default = router;
