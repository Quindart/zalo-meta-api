import express from "express";
import ROUTING from "../../constants/Routes.ts";
import messageController from "../handlers/message.controller.ts";
const router = express.Router();

router.get(ROUTING.MESSAGE_BY_RECEIVERID_SENDERID, messageController.getMessages);
router.get(ROUTING.BY_ID,  messageController.getMessageById);

export default router;