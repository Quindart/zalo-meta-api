import express from "express";
import ROUTING from "../../constants/Routes.js";
import userController from "../handlers/user.controller.js";
const router = express.Router();

router.get(ROUTING.INDEX, userController.getMe);

export default router