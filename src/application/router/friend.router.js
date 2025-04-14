import express from "express";
import ROUTING from "../../constants/Routes.js";
import friendController from "../handlers/friend.controller.js";
const router = express.Router();

router.post(ROUTING.FRIEND_REQUEST_LIST, friendController.getFriendList);

export default router;