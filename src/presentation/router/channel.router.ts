import express from "express";
import ROUTING from "../../constants/Routes";
import channelController from "../handlers/channel.controller";
const router = express.Router();


router.post(ROUTING.INDEX, channelController.createGroup);

router.put(ROUTING.ASSIGN_ROLE, channelController.assignRoleMember);
router.put(ROUTING.OUT_CHANNEL, channelController.outChannel);
router.post(ROUTING.MEMBER, channelController.addMemberToChannel);
router.get(ROUTING.MEMBER, channelController.getAllMember);
router.get(ROUTING.INDEX, channelController.getAllChannel);
router.get(ROUTING.BY_ID, channelController.getChannelByID);

export default router;
