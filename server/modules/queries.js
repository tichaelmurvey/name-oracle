const mongoose = require("mongoose")
const Name = require("./schema/name")

exports.findNames = async function (type_input, setting_input, role_input) {
    try {
        const name_result = await Name.find({type: type_input, setting: setting_input, role: role_input})
        name_result = name_result.filter(Boolean) 
        console.log(name_result)
        return(name_result)
    } catch(error) {
        console.log(error.message)
    }
}

exports.getUnique = async function (key) {
    try {
        const unique_results = await Name.find().distinct(key)
        return(unique_results.filter(n => n))
    } catch(error) {
        console.log(error.message)
    }
}