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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *       example:
 *         id: 60d5ec49b9b3f8246c8b4567
 *         email: "example@gmail.com"
 *         password: "hashedpassword"
 *         firstName: "John"
 *         lastName: "Doe"
 *         phone: "123456789"
 *
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
