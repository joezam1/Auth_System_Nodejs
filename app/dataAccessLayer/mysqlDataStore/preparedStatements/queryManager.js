
//Test: DONE
let selectWhereEqualsAnd = function(tableName, sequelizePropertiesArray){

    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        if(a <= (totalArrayElements - 2))
        allProperties += sequelizePropertiesArray[a].field +' = ? AND '
        if(a == (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
    }
    let statement = `SELECT * FROM ${tableName} WHERE ${allProperties}`;

    return statement;
}
//Test: DONE
let selectAllFromTable = function(tableName){
    let statement = `SELECT * FROM ${tableName}`;

    return statement;
}

//Test: DONE
let insertIntoTableValues = function(tableName, sequelizePropertiesArray){

    let columnNames = '';
    let values = '';
    for(let a = 0; a< sequelizePropertiesArray.length ; a++){
        if(a == 0){
            columnNames += ''+sequelizePropertiesArray[a].field;
            values += '?';
        }else{
            columnNames += ','+sequelizePropertiesArray[a].field;
            values += ',?'
        }
    }
    var statement = `INSERT INTO ${tableName} ( ${columnNames} ) VALUES ( ${values} );`;

    return statement;
}


let service = {
    selectWhereEqualsAnd : selectWhereEqualsAnd,
    selectAllFromTable : selectAllFromTable,
    insertIntoTableValues : insertIntoTableValues
}

module.exports = service;