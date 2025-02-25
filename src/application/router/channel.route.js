import express from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import ROUTING from "../../constants/Routes.js";
import channelController from "../handlers/channel.controller.js";
const router = express.Router();

router.use((req, res, next) => {
    console.log(`📌 Received request: ${req.method} ${req.originalUrl}`);
    next();
});

// 📌 Các route PUT cần đặt trước
router.put(ROUTING.ASSIGN_ROLE, channelController.assignRoleMember);
router.put(ROUTING.OUT_CHANNEL, channelController.outChannel);
router.post(ROUTING.MEMBER, channelController.addMemberToChannel);

// 📌 Các route GET với đường dẫn cố định
router.get(ROUTING.MEMBER, channelController.getAllMember);
router.get(ROUTING.INDEX, channelController.getAllChannel);

// 📌 Route động (/:id) đặt cuối cùng
router.get(ROUTING.BY_ID, channelController.getChannelByID);

// 📌 Các route POST
router.post(ROUTING.INDEX, channelController.createGroup);


// //TODO [DELETE]
// router.delete(ROUTING.BY_ID, userController.deleteUser);


export default router;
