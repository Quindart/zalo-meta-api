import express from "express";
import ROUTING from "../../constants/Routes.js";
import messageController from "../handlers/message.controller.js";
const router = express.Router();

router.get(ROUTING.MESSAGE_BY_RECEIVERID_SENDERID, (req, res) => messageController.getMessages(req, res));

export default router;