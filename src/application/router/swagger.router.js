import fs from "fs";
import yaml from "yaml";

import express from "express";
import ROUTING from "../../constants/Routes.js";
import swaggerUi from "swagger-ui-express";
const router = express.Router();

const swaggerFile = fs.readFileSync(
  "src/infrastructure/swagger/swagger.yaml",
  "utf8"
);
const swaggerDocument = yaml.parse(swaggerFile);

router.use(ROUTING.SWAGGER, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
