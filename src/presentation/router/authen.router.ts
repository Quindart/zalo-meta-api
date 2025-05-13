import express from "express";
import ROUTING from "../../constants/Routes";
import authenController from "../handlers/authen.controller";
import { authenticateToken } from "../middleware/authentication.middleware";
import QRController from "../handlers/QR.controller";
import { detectDevice } from "../middleware/detectDevice.middleware";
const router = express.Router();

router.post(ROUTING.LOGIN, async (req, res) => {
    await authenController.login(req, res);
});

router.post(ROUTING.REGISTER, (req, res) => { authenController.register(req, res) });
router.post(ROUTING.REFRESH_TOKEN, (req, res) => { authenController.refreshToken(req, res) });
router.post(ROUTING.FORGOT_PASSWORD, (req, res) => { authenController.forgotPassword(req, res) });
// router.post(ROUTING.VERIFY_EMAIL, (req, res) => { authenController.verifyEmail(req, res) });
router.get(ROUTING.LOGOUT, (req, res, next) => { authenticateToken(req, res, next) }, (req, res) => { authenController.logout(req, res) });
router.post(ROUTING.CHANGE_PASSWORD, (req, res, next) => { authenticateToken(req, res, next) }, (req, res) => { authenController.changePassword(req, res) });
router.post(ROUTING.VERIFY_FORGOT_PASSWORD, (req, res) => { authenController.verifyForgotPassword(req, res) });
router.post(ROUTING.RESET_PASSWORD, (req, res) => { authenController.resetPassword(req, res) });


router.post(ROUTING.QR, detectDevice, QRController.generateQR);
router.get(ROUTING.QR, QRController.getInfoQR);


router.post(ROUTING.QR_LOGIN, (req, res) => { QRController.loginQR(req, res) });
router.post(ROUTING.FCM, (req, res) => { authenController.registerFcmToken(req, res) });

export default router;