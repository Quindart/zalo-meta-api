"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const user_controller_1 = __importDefault(require("../handlers/user.controller"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const cloudinary_middleware_1 = require("../middleware/cloudinary.middleware");
const router = express_1.default.Router();
//TODO: ME
router.get(Routes_1.default.INDEX, authentication_middleware_1.authenticateToken, user_controller_1.default.getMe);
router.put(Routes_1.default.INDEX, authentication_middleware_1.authenticateToken, cloudinary_middleware_1.imageUpload, user_controller_1.default.updateMe);
router.put(Routes_1.default.CHANGE_PASSWORD, authentication_middleware_1.authenticateToken, user_controller_1.default.changePassword);
exports.default = router;
