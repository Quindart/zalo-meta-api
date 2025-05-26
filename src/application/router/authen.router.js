import express from "express";
import ROUTING from "../../constants/Routes.js";
import authenController from "../handlers/authen.controller.js";
import { authenticateToken } from "../middleware/authentication.middleware.js";
import QRController from "../handlers/QR.controller.js";
import { detectDevice } from "../middleware/detectDevice.middleware.js";
const router = express.Router();

router.post(ROUTING.LOGIN, (req, res) => authenController.login(req, res));
router.post(ROUTING.REGISTER, (req, res) => authenController.register(req, res));
router.post(ROUTING.REFRESH_TOKEN, (req, res) => authenController.refreshToken(req, res));
router.post(ROUTING.FORGOT_PASSWORD, (req, res) => authenController.forgotPassword(req, res));
router.post(ROUTING.VERIFY_EMAIL, (req, res) => authenController.verifyEmail(req, res));
router.get(ROUTING.LOGOUT, (req, res) => authenticateToken, (req, res) => authenController.logout(req, res));
router.post(ROUTING.CHANGE_PASSWORD, (req, res) => authenticateToken, (req, res) => authenController.changePassword(req, res));
router.post(ROUTING.VERIFY_FORGOT_PASSWORD, (req, res) => authenController.verifyForgotPassword(req, res));
router.post(ROUTING.RESET_PASSWORD, (req, res) => authenController.resetPassword(req, res));


router.post(ROUTING.QR, detectDevice, QRController.generateQR);
router.get(ROUTING.QR, QRController.getInfoQR);
router.post(ROUTING.QR_LOGIN, (req, res) => QRController.loginQR(req, res));

router.post(ROUTING.FCM, (req, res) => authenController.registerFcmToken(req, res));

//Login with Google
router.get(ROUTING.GOOGLE_LOGIN, (req, res) => authenController.googleLogin(req, res));
router.get(ROUTING.GOOGLE_CALLBACK, (req, res) => authenController.googleCallback(req, res));

export default router;