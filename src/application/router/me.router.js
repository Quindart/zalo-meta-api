import express from "express";
import ROUTING from "../../constants/Routes.js";
import userController from "../handlers/user.controller.js";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.middleware.js";

router.get(ROUTING.ME, authenticateToken, userController.getMe);

export default router