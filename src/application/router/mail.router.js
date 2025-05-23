import express from "express";
import ROUTING from "../../constants/Routes.js";
import mailController from "../handlers/mail.controller.js";
const router = express.Router();

router.post(ROUTING.MAIL_SEND, (req, res) => mailController.sendMail(req, res));
router.post(ROUTING.MAIL_VERIFY, (req, res) => mailController.verifyOTP(req, res));

export default router;