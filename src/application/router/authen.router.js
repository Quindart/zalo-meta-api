import express from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import ROUTING from "../../constants/Routes.js";
import authenController from "../handlers/authen.controller.js";
import { authenticateToken } from "../middleware/authentication.middleware.js";
const router = express.Router();
router.post(ROUTING.LOGIN, (req, res) => authenController.login(req, res));
router.post(ROUTING.REFRESH_TOKEN, (req, res) => authenController.refreshToken(req, res));
router.post(ROUTING.REGISTER, (req, res) => authenController.register(req, res));
router.post(ROUTING.FORGOT_PASSWORD, (req, res) => authenController.forgotPassword(req, res));
router.post(ROUTING.VERIFY_EMAIL, (req, res) => authenController.verifyEmail(req, res));
router.get(ROUTING.LOGOUT, authenticateToken, (req, res) => authenController.logout(req, res));

export default router;