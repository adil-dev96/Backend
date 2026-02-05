const mongoose = require("mongoose");

const noteSchmma = new mongoose.Schema({
  title: String,
  description: String,
});


const noteModel = mongoose.model('notes' , noteSchmma)

module.exports = noteModel