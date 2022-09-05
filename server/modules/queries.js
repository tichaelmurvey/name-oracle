const mongoose = require("mongoose")
const Name = require("./schema/name")

//mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true})

exports.addUser = async function run() {
    const testname = new Name({name: "Kyle", setting: ["Modern"], type: "First"})
    await testname.save()
    console.log(testname)
}

exports.findNames = async function (type_input, setting_input, role_input) {
    try {
        const name_result = await Name.find({type: type_input, setting: setting_input, role: role_input})
        console.log(name_result)
    } catch(error) {
        console.log(error.message)
    }
}
