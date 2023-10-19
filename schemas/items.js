const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  name: String,
  status: String,
  ordering: Number,
  date: Date,
});

module.exports = mongoose.model("items", schema);
