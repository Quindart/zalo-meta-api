const mongoose = require("mongoose");
const appConfig = require("../../../../config");

class ConnectionMongoDB {
  async connect() {
    try {
      await mongoose.connect(appConfig.mongo.url, {
        useNewUrlParser: true,
      });
      console.log("🚀 ~~~ connected to Atlas::::Zalo-Meta-api ");
    } catch (error) {
      console.log("🚀 ~ ConnectionMongoDB ~ connect ~ error:", error)
    }
  }
}
module.exports = new ConnectionMongoDB();
