const mongoose = require("mongoose")

const nameSchema = new mongoose.Schema({
    Name: String,
    Type: String,
    Setting: []
})

module.exports = mongoose.model("Name", nameSchema)