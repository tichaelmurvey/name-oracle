const mongoose = require("mongoose")

const nameSchema = new mongoose.Schema({
    name: String,
    type: [],
    setting: [],
    role: []
})

module.exports = mongoose.model("Name", nameSchema)