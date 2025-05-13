import express from "express";
import ROUTING from "../../constants/Routes";
import friendController from "../handlers/friend.controller";
import { authenticateToken } from "../middleware/authentication.middleware";
const router = express.Router();


router.post(ROUTING.FRIEND_REQUEST_LIST, friendController.getFriendList);
router.put(ROUTING.INDEX, authenticateToken, friendController.accpetFriend);

//TODO MY FRIEND
router.get(ROUTING.INDEX, authenticateToken, friendController.getMyFriends);
router.get(ROUTING.INDEX, authenticateToken, friendController.removeFriend);

//TODO ACCEPT FRIEND
router.delete(ROUTING.INDEX, authenticateToken, friendController.rejectAcceptFriend);

//TODO: INVITE FRIEND
router.get(ROUTING.MY_INVITE_FRIENDS_REQUEST, authenticateToken, friendController.getMyInviteFriends);
router.get(ROUTING.MY_INVITED_SENDING_REQUEST, authenticateToken, friendController.getMyInvitedSending);
router.post(ROUTING.ALL_INVITED_REQUEST, authenticateToken, friendController.inviteFriend);
router.post(ROUTING.MY_INVITE_FRIENDS_REQUEST, authenticateToken, friendController.inviteFriend);
router.delete(ROUTING.MY_INVITE_FRIENDS_REQUEST, authenticateToken, friendController.removeIniviteFriend);


export default router;