import express from "express";
import ROUTING from "../../constants/Routes.js";
import userController from "../handlers/user.controller.js";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.middleware.js";
import { imageUpload } from "../middleware/cloudinary.middleware.js"


router.get(ROUTING.INDEX, authenticateToken, userController.getMe);

router.put(ROUTING.INDEX, authenticateToken, imageUpload, userController.updateMe);

router.put(ROUTING.CHANGE_PASSWORD, authenticateToken, userController.changePassword);

export default router