const mongoose = require("mongoose");

var Logs = mongoose.model("Logs", {
  user: { type: String },
  info: { type: String },
  category: { type: String },
  date: { type: String },
});

module.exports = { Logs };
