import express from "express";
import ROUTING from "../../constants/Routes";
import userController from "../handlers/user.controller";
import { authenticateToken } from "../middleware/authentication.middleware";
const router = express.Router();

//TODO [GET]
router.get(ROUTING.INDEX, userController.getUsers);
router.get(ROUTING.SEARCH, userController.searchUsers)
router.get(ROUTING.SEARCH_FRIEND, authenticateToken, userController.searchUserWithFriends);
router.get(ROUTING.BY_ID, userController.getUserById);
router.get(ROUTING.BY_PHONE, userController.getUserByPhone);
//TODO [POST]
router.post(ROUTING.INDEX, userController.createUser);
router.put(ROUTING.BY_ID, userController.updateUser);
//TODO [DELETE]
router.delete(ROUTING.BY_ID, userController.deleteUser);
export default router;
