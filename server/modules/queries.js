const mongoose = require("mongoose")
const Name = require("./schema/name")

//mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true})

exports.addUser = async function run() {
    const testname = new Name({name: "Kyle", setting: ["Modern"], type: "First"})
    await testname.save()
    console.log(testname)
}

exports.findUser = async function () {
    try {
        const name_result = await Name.find({Type: "First", Setting: "High fantasy"})
        console.log(name_result)
    } catch(error) {
        console.log(error.message)
    }
}
