import express from "express";
import { HTTP_STATUS } from "../../constants/index.js";
import ROUTING from "../../constants/Routes.js";
const router = express.Router();

router.get(ROUTING.API, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    title: "hell",
  });
});

export default router;
