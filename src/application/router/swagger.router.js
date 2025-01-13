import express from "express";
import ROUTING from "../../constants/Routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../infrastructure/swagger/swagger.json" assert { type: "json" };
const router = express.Router();

router.use(ROUTING.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
