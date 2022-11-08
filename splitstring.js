// db.names.updateMany(
//     {},
//     [{$addFields:{"tags": { "$split": [ "$tags", "," ]}}
//     }]
//     )
// db.names.updateMany(
//     {},
//     [{$addFields:{"role": { "$split": [ "$role", "," ]}}
//     }]
//     )
// db.names.updateMany(
//     {},
//     [{$addFields:{"setting": { "$split": [ "$setting", "," ]}}
//     }]
//     )
db.names.updateMany( {}, { $rename: {"gender":"tags"}})