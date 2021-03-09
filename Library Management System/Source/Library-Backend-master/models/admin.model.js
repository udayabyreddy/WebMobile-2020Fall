const mongoose = require("mongoose");

var Admin = mongoose.model("Admin", {
  username: { type: String },
  password: { type: String },
  active: { type: Boolean },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  joined: { type: String },
  gender: { type: String },
  isDefault: { type: Boolean },
  address: { type: String }
});

module.exports = { Admin };
