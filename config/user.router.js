import express from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import ROUTING from "../../constants/Routes.js";
import userController from "../handlers/user.controller.js";
const router = express.Router();

//TODO [GET]
router.get(ROUTING.INDEX, userController.getUsers);
router.get(ROUTING.BY_ID, userController.getUserById);
//TODO [POST]
router.post(ROUTING.INDEX, userController.createUser);
router.put(ROUTING.BY_ID, userController.updateUser);
//TODO [DELETE]
router.delete(ROUTING.BY_ID, userController.deleteUser);
export default router;
