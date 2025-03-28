import express from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import ROUTING from "../../constants/Routes.js";
import authenController from "../handlers/authen.controller.js";
import { authenticateToken } from "../middleware/authentication.middleware.js";
const router = express.Router();
router.post(ROUTING.LOGIN,  authenController.login);
router.post(ROUTING.REFRESH_TOKEN,  authenController.refreshToken);
router.post(ROUTING.REGISTER,  authenController.register);
router.post(ROUTING.FORGOT_PASSWORD,  authenController.forgotPassword);
router.post(ROUTING.VERIFY_EMAIL,  authenController.verifyEmail);
router.get(ROUTING.LOGOUT, authenticateToken,  authenController.logout);
router.post(ROUTING.CHANGE_PASSWORD, authenticateToken,  authenController.changePassword);
router.post(ROUTING.VERIFY_FORGOT_PASSWORD,  authenController.verifyForgotPassword);
router.post(ROUTING.RESET_PASSWORD,  authenController.resetPassword);

export default router;