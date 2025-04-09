import express from "express";
import ROUTING from "../../constants/Routes.js";
import userController from "../handlers/user.controller.js";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.middleware.js";

router.get(ROUTING.INDEX, authenticateToken, userController.getMe);
router.put(ROUTING.INDEX, authenticateToken, userController.updateMe);

router.put(ROUTING.CHANGE_PASSWORD, authenticateToken, userController.changePassword);

export default router