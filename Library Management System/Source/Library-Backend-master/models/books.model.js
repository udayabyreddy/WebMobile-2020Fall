const mongoose = require("mongoose");

var Books = mongoose.model("Books", {
  booktitle: { type: String },
  author: { type: String },
  category: { type: String },
  desc: { type: String },
  stock: { type: Number },
  ISBN: { type: Number, unique: true },
  issuedTo: { type: String },
  issuedDate: { type: String },
  returnDate: { type: String },
});

module.exports = { Books };
