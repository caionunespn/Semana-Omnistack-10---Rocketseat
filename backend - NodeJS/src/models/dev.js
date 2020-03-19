const { Schema, model } = require("mongoose");
const pointSchema = require("./utils/pointSchema");

const devSchema = new Schema({
   name: String,
   githubUsername: String,
   bio: String,
   avatarUrl: String,
   techs: [String],
   location: {
      type: pointSchema,
      index: "2dsphere"
   }
}, {
   timestamps: true
});

module.exports = model("Dev", devSchema);