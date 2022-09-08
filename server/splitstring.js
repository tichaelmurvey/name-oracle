db.names.updateMany(
    {},
    [{$addFields:{"tags": { "$split": [ "$tags", "," ]}}
    }]
    )