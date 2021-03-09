const mongoose = require("mongoose");

var User = mongoose.model("User", {
  username: { type: String ,unique: true},
  password: { type: String },
  active: { type: Boolean },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String ,unique: true},
  joined: { type: String },
  gender: { type: String },
  address: { type: String },
  booksissued: { type: Number },
});

module.exports = { User };
