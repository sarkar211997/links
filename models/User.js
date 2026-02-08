const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  links: {
    instagram: String,
    youtube: String,
    twitter: String
  }
});

module.exports = mongoose.model("User", userSchema);
