import express from "express";
import ROUTING from "../../constants/Routes.ts";
import userController from "../handlers/user.controller.ts";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.middleware.ts";
import { imageUpload } from "../middleware/cloudinary.middleware.ts"
import friendController from "../handlers/friend.controller.ts";


//TODO: ME
router.get(ROUTING.INDEX, authenticateToken, userController.getMe);
router.put(ROUTING.INDEX, authenticateToken, imageUpload, userController.updateMe);
router.put(ROUTING.CHANGE_PASSWORD, authenticateToken, userController.changePassword);





export default router