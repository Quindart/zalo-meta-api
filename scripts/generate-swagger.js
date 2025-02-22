import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import UserModel from "../src/infrastructure/mongo/model/User.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertMongooseToOpenAPI = (model) => {
  const schema = model.schema.obj;
  let properties = {};

  for (const key in schema) {
    let type = typeof schema[key] === "object" ? schema[key].type : schema[key];
    if (Array.isArray(type)) type = "array";
    if (type === String) type = "string";
    if (type === Number) type = "number";
    if (type === Boolean) type = "boolean";

    properties[key] = { type };
  }

  return {
    type: "object",
    properties,
  };
};
const Components = {
  User: {
    convert: convertMongooseToOpenAPI(UserModel),
    key: "user",
  },
};

const swaggerDir = path.join(
  __dirname,
  "../src/infrastructure/swagger/components"
);
const userYamlPath = path.join(swaggerDir, Components.User.key + ".yaml");

if (!fs.existsSync(swaggerDir)) fs.mkdirSync(swaggerDir, { recursive: true });

fs.writeFileSync(
  userYamlPath,
  `User:\n${JSON.stringify(Components.User, null, 2)}`
);

console.log("✅ User component generated successfully!");
