"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("../../constants/Routes"));
const authen_controller_1 = __importDefault(require("../handlers/authen.controller"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const QR_controller_1 = __importDefault(require("../handlers/QR.controller"));
const detectDevice_middleware_1 = require("../middleware/detectDevice.middleware");
const router = express_1.default.Router();
router.post(Routes_1.default.LOGIN, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authen_controller_1.default.login(req, res);
}));
router.post(Routes_1.default.REGISTER, (req, res) => { authen_controller_1.default.register(req, res); });
router.post(Routes_1.default.REFRESH_TOKEN, (req, res) => { authen_controller_1.default.refreshToken(req, res); });
router.post(Routes_1.default.FORGOT_PASSWORD, (req, res) => { authen_controller_1.default.forgotPassword(req, res); });
// router.post(ROUTING.VERIFY_EMAIL, (req, res) => { authenController.verifyEmail(req, res) });
router.get(Routes_1.default.LOGOUT, (req, res, next) => { (0, authentication_middleware_1.authenticateToken)(req, res, next); }, (req, res) => { authen_controller_1.default.logout(req, res); });
router.post(Routes_1.default.CHANGE_PASSWORD, (req, res, next) => { (0, authentication_middleware_1.authenticateToken)(req, res, next); }, (req, res) => { authen_controller_1.default.changePassword(req, res); });
router.post(Routes_1.default.VERIFY_FORGOT_PASSWORD, (req, res) => { authen_controller_1.default.verifyForgotPassword(req, res); });
router.post(Routes_1.default.RESET_PASSWORD, (req, res) => { authen_controller_1.default.resetPassword(req, res); });
router.post(Routes_1.default.QR, detectDevice_middleware_1.detectDevice, QR_controller_1.default.generateQR);
router.get(Routes_1.default.QR, QR_controller_1.default.getInfoQR);
router.post(Routes_1.default.QR_LOGIN, (req, res) => { QR_controller_1.default.loginQR(req, res); });
router.post(Routes_1.default.FCM, (req, res) => { authen_controller_1.default.registerFcmToken(req, res); });
exports.default = router;
