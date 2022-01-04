const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, length: 13, required: true, unique: true },
  password: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
