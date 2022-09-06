
const queries = require("./queries")

//Constructor for name pattern objects, which are a single possible name structure
class namePattern { 
    constructor(pattern, weight){
        //Array of data parameters the pattern needs
        let params = [];
        //Sequence of params and also static text, in order.
        let sequence = pattern.split(" ");
        sequence.forEach((fragment) => {
            if(fragment.startsWith("_")){
                params.push(fragment);
            }
        });
        this.params = params;
        this.sequence = sequence;
        this.weight = weight;
    }
    //Generate name outputs using this pattern
    makeNames(name_data, quant){
        let names = [];
        for(let i=0; i<quant; i++){
            let name_output = [...this.sequence];
            this.params.forEach((param) => {
                //Get the relevant list of names
                let list = name_data.filter((name_item) => {
                    return "_".concat(name_item.type) == param
                })
                //Get a random item from the list (pending data structure)
                let item_index = Math.round(Math.random()*(list.length-1));
                let item = list[item_index];
                //Remove the used item from the array. 
                //NOTE: maybe come back here and create a "reuse" condition for some lists
                list.splice(item_index, 1);
                //Replace param placeholder in name with item name value (pending data structure)
                name_output[name_output.indexOf(param)] = item.name;
            });
            name_output = name_output.join(" ")
            names.push(name_output);
        }
        return(names);
    }
}

let name_patterns = {
    knight: [
        new namePattern("_First of _Last", 2)//,
        // new namePattern("Sir _First , _Lastname of _location", 3),
        // new namePattern("_First , the _heraldry knight", 1),
        // new namePattern("Sir _First _Last", 3),
        // new namePattern("Sir _First the _adjective", 2),
        // new namePattern("_First _Last , the knight of _Heraldry", 1)
    ],
    commoner: [
        new namePattern("_First _Last", 10),
        new namePattern("Old _First", 1),
        new namePattern("Granny _Last", 1),
        new namePattern("Little _First", 1),
        new namePattern("Young _First", 1),
    ],
    monarch: []
}

//For a given pattern system, returns an array of distinct name types required by any pattern which occurs more than 0 times
function getTypes(pattern_system){
    let types = [];

    pattern_system.patterns.forEach((pattern, index) => {
        if(pattern_system.quant[index]){
            pattern.params.forEach(param => {
                if(!types.includes(param)){
                    types.push(param);
                }
            });
        }

    });
    return(types);
}

//For a given role, returns a set of name patterns, and the number required for each one
function getPatternSystem(role, number){
    let patterns = name_patterns[role];
    console.log("Got patterns for role. Example pattern:")
    console.log(patterns[0])
    let unfilled = number;
    let pattern_system = {
        patterns: patterns,
        quant: []
    };
    
    total_weight = patterns.reduce((x, y) => {
        return x + y.weight;
    }, 0);

    if(total_weight <= number){
        //Fill the slots with name patterns by literally just dumping in a number equal to the weight until no more fit
        let times = Math.floor(number/total_weight);
        pattern_system.quant = patterns.map((pattern) => {
            return pattern.weight*times;
        });
        unfilled -= total_weight*times;
    } else {
        pattern_system.quant = Array(patterns.length).fill(0);
    }

    if(unfilled){
        //Fill the remaining slots with randomly selected patterns
        let rollable_table = patterns.reduce((passthrough, pattern) => {
            return passthrough.concat(
                Array(pattern.weight)
                .fill(pattern)
                );
        }, new Array);
        for(i=0; i<unfilled; i++){
            //Add one to the count of a randomly chosen pattern
            pattern_system.quant[
                patterns
                .indexOf(
                    rollable_table[
                        Math.round(Math.random()*(rollable_table.length-1))
                    ])
                ] += 1;
        }

    }
    
    return(pattern_system);
}

exports.getNames = async function(role, setting, num){
    try {
        console.log("getnames function Received request for names")
        let pattern_system = getPatternSystem(role, num); //Craete the pattern system
        console.log("Made pattern system. Here's an example pattern:")
        console.log(pattern_system.patterns[0])
        let types = getTypes(pattern_system); //List the distinct types required
        console.log("Got types list. Here's an example of a required type:")
        console.log(types[0])
        //Strip leading characters from types
        let type_requests = types
        type_requests.forEach((type, index) => {
            type_requests[index] = type.replace("_", "")
        })
        console.log("Removed leading tag indicator from types. Heres an example of a cleaned type:")
        console.log(type_requests[0])
        console.log("Requesting name data with variables:")
        console.log("Types: " + type_requests)
        console.log("Role: " + role)
        console.log("Setting: " + setting)
        let name_data = await queries.findNamesManyTypes(type_requests, setting, role); //Get the name data from the server
        console.log("Got " + name_data.length + " names. Here's an example name:")
        console.log(name_data[0])
        let names = []
        pattern_system.patterns.forEach((pattern, index) => {
            let current_quant = pattern_system.quant[index]
            if(current_quant){
                names.push(...pattern.makeNames(name_data, current_quant))
            }
            console.log("Added " + current_quant + " names in pattern:")
            console.log(pattern)
        });
        console.log("Got the names. Here's an example:")
        console.log(names)
        return(names)
    } catch(error) {
        console.log(error.message)
    }
}