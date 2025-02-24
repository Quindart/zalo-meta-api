import express from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import ROUTING from "../../constants/Routes.js";
import authenController from "../handlers/authen.controller.js";
const router = express.Router();


router.post(ROUTING.LOGIN, (req, res) => authenController.login(req, res));
router.post(ROUTING.REFRESH_TOKEN, (req, res) => authenController.refreshToken(req, res));

export default router;