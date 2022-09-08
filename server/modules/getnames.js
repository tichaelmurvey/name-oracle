
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
        new namePattern("_first of _last", 2),
        new namePattern("Sir _first  _last of _location", 3),
        new namePattern("_First , the _heraldry knight", 1),
        new namePattern("Sir _first _last", 3),
        new namePattern("Sir _first the _adjective", 2),
        new namePattern("_first _last , the knight of _heraldry", 1),
    ],
    commoner: [
        new namePattern("_first _last", 40),
        new namePattern("Old _first", 1),
        new namePattern("Granny _last", 1),
        new namePattern("Little _first", 1),
        new namePattern("Young _first", 1),
    ],
    monarch: [
        new namePattern("King _first _last", 5),
        new namePattern("King _first the _numeral", 5),
        new namePattern("King _first , _numeral of his name", 2),
        new namePattern("Queen _first _last", 5),
        new namePattern("Queen _first the _numeral", 5),
        new namePattern("Queen _first , _numeral of her name", 2),
        new namePattern("King _first the _adjective", 4),
        new namePattern("Queen _first the _adjective", 4),
        new namePattern("_honorific King _first _last", 4),
        new namePattern("_honorific Queen _first _last", 4)
    ],
    noble: [
        new namePattern("_first _last", 5),
        new namePattern("_first , _title of _location", 5),
        new namePattern("_first of house _last", 5),
        new namePattern("_title _first", 5),
        new namePattern("_title _last", 5),
        new namePattern("_honorific _first _last , _title of _location", 5)
    ],
    wizard: [
        new namePattern("_first _last", 5),
        new namePattern("_first the _colour", 5),
        new namePattern("_first , Master of _element", 5),
        new namePattern("_first of _location", 5),
        new namePattern("_first the _adjective")
    ],
    innkeeper: [
        new namePattern("_first _last", 20),
        new namePattern("Old _first", 1),
        new namePattern("Granny _last", 1),
        new namePattern("Little _first", 1),
        new namePattern("Young _first", 1),
    ],
    hero:[
        new namePattern("_first _last", 30),
        new namePattern("_first the _adjective", 2),
        new namePattern("_colour _first", 1),
    ]

}

//For a given pattern system, returns an array of distinct name types required by any pattern which occurs more than 0 times
function getTypes(pattern_system){
    let types = [];

    pattern_system.forEach((item, index) => {
        item.pattern.params.forEach(param => {
            if(!types.includes(param)){
                types.push(param);
            }
        });
    });
    return(types);
}

//For a given role, returns a set of name patterns, and the number required for each one
function getPatternSystem(role, number){
    let patterns = name_patterns[role];
    console.log("Got patterns for role. Example pattern:")
    console.log(patterns[0])
    let unfilled = number;
    let pattern_system = patterns.map(item => {
        return {
            pattern: item,
            quant: 0
        }
    });
    total_weight = patterns.reduce((x, y) => {
        return x + y.weight;
    }, 0);

    if(total_weight <= number){
        //Fill the slots with name patterns by literally just dumping in a number equal to the weight until no more fit
        let times = Math.floor(number/total_weight);
        for(i=0; i<times; i++){
            pattern_system.map((item, index) => {
                pattern_system[index].quant += item.pattern.weight;
            });
        }
        unfilled -= total_weight*times;
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
            pattern_system[
                patterns
                .indexOf(
                    rollable_table[
                        Math.round(Math.random()*(rollable_table.length-1))
                    ])
                ].quant += 1;
        }

    }
    pattern_system = pattern_system.filter((pattern) => {
        return pattern.quant > 0;
    });
    return(pattern_system);
}

exports.getNames = async function(role, setting, num){
    try {
        console.log("getnames function Received request for names")
        let pattern_system = getPatternSystem(role, num); //Craete the pattern system
        console.log("Made pattern system with " + pattern_system.length + " patterns. Here's an example pattern:")
        console.log(pattern_system[0].pattern)
        let types = getTypes(pattern_system); //List the distinct types required
        console.log("Got types list. Here's an example of a required type:")
        console.log(types[0])
        //Strip leading characters from types
        let type_requests = types
        type_requests.forEach((type, index) => {
            type_requests[index] = type.replace("_", "")
        })
        console.log("Requesting name data with variables:")
        console.log("Types: " + type_requests)
        console.log("Role: " + role)
        console.log("Setting: " + setting)
        let name_data = await queries.findNamesManyTypes(type_requests, setting, role); //Get the name data from the server
        console.log("Got " + name_data.length + " names. Here's an example name:")
        console.log(name_data[0])
        let names = []
        pattern_system.forEach((item) => {
            names.push(...item.pattern.makeNames(name_data, item.quant))
            console.log("Added " + item.quant + " names in pattern:")
            console.log(item.pattern)
        });
        console.log("Created " + names.length + " names. Here's an example:")
        console.log(names[0])
        return(names)
    } catch(error) {
        console.log(error.message)
    }
}