const mongoose = require('mongoose')


const noteSchmea = new mongoose.Schema({
    title: String,
    description: String,
})

const noteModel = mongoose.model('notes', noteSchmea)

module.exports = noteModel