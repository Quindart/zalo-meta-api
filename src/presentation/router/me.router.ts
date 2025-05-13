import express from "express";
import ROUTING from "../../constants/Routes";
import userController from "../handlers/user.controller";
import { authenticateToken } from "../middleware/authentication.middleware";
import { imageUpload } from "../middleware/cloudinary.middleware"
const router = express.Router();


//TODO: ME
router.get(ROUTING.INDEX, authenticateToken, userController.getMe);
router.put(ROUTING.INDEX, authenticateToken, imageUpload, userController.updateMe);
router.put(ROUTING.CHANGE_PASSWORD, authenticateToken, userController.changePassword);





export default router