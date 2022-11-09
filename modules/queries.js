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

exports.findNamesManyTypes = async function (types, setting_input, role_input) {
    try {
        let name_result = await Name.find({type: { $in: types}, setting: { $in: [setting_input, "all"] }, role: { $in: [role_input, "all"]}})
        for (const test_type of types) {
            if(name_result.some(result => result.type.includes(test_type))){
                console.log("Confirmed at least one with type " + test_type);
            } else {
                console.log("Found no names with type " + test_type);
                console.log("Trying with no role restriction");
                let no_role = await Name.find({type: test_type, setting: { $in: [setting_input, "all"] }});
                if(no_role.some(result => result.type.includes(test_type))){
                    console.log("Added " + no_role.length + " of " + test_type + " with no role");
                    name_result = name_result.concat(no_role);
                } else {
                    console.log("Trying with generic fantasy setting");
                    let no_setting = await Name.find({type: test_type, setting: { $in: ["highfantasy", "lowfantasy", "medieval", "all"] }});
                    if(no_setting.some(result => result.type.includes(test_type))){
                        console.log("Added " + no_setting.length + " of " + test_type + " with no role and generic fantasy setting");
                        name_result = name_result.concat(no_setting);
                    }  else {
                        console.log("Couldn't find any good type results")
                        return false;
                    }
                }
            }
        }
        console.log("Search query done. ")
        return(name_result)
    } catch(error) {
        console.log("Find names many types threw: " + error.message)
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