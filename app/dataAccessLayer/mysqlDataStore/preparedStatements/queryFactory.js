const genericQueryStatement = require('../../../library/enumerations/genericQueryStatement.js');


//Test: DONE
let selectWherePropertyEqualsAnd = function(tableName, sequelizePropertiesArray){

    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        if(a <= (totalArrayElements - 2)){
            allProperties += sequelizePropertiesArray[a].field +' = ? AND '
        }
        if(a == (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
    }
    let statement = `SELECT * FROM ${tableName} WHERE ${allProperties}`;

    return statement;
}

//Test: DONE
let selectWherePropertyEqualsAndIsNull = function(tableName, sequelizePropertiesArray, isNullOrderOfAppearenceInPropertiesArray){

    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        let valueFound = isNullOrderOfAppearenceInPropertiesArray.find((value)=>{
            return value === a;});
        if(valueFound){
            allProperties += sequelizePropertiesArray[a].field +' IS NULL '
        }
        else if(a <= (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
        if(a <= (totalArrayElements - 2)){
            allProperties += ' AND '
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
//Test: DONE
let deleteFromTableWhere = function(tableName, sequelizePropertiesArray){

    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        if(a <= (totalArrayElements - 2)){
            allProperties += sequelizePropertiesArray[a].field +' = ? AND '
        }
        if(a == (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
    }
    let statement = `DELETE FROM ${tableName} WHERE ${allProperties}`;

    return statement;
}
//Test: DONE
let updateTableSetColumnValuesWhere = function(tableName, sequelizePropertiesArray , sequelizeWhereConditionPropertiesArray){
    let allProperties = '';
    let totalArrayElements = sequelizePropertiesArray.length;
    for(let a = 0; a < totalArrayElements; a++){
        if(a <= (totalArrayElements - 2)){
            allProperties += sequelizePropertiesArray[a].field +' = ? , '
        }
        if(a == (totalArrayElements - 1)){
            allProperties += sequelizePropertiesArray[a].field +' = ?'
        }
    }

    let allConditionalProperties = '';
    if(sequelizeWhereConditionPropertiesArray !== null && Array.isArray(sequelizeWhereConditionPropertiesArray)){
        allConditionalProperties += ' WHERE ';
        let totalConditionalElement = sequelizeWhereConditionPropertiesArray.length;
        for(let b = 0; b< totalConditionalElement; b++){
            if(b <= (totalConditionalElement - 2)){
                allConditionalProperties += sequelizeWhereConditionPropertiesArray[b].field +' = ? AND '
            }
            if(b == (totalConditionalElement - 1)){
                allConditionalProperties += sequelizeWhereConditionPropertiesArray[b].field +' = ?'
            }
        }
    }
    let statement = `UPDATE ${tableName} SET ${allProperties} ${allConditionalProperties}`;

    return statement;
}

//Test: DONE
let createSimpleQueryStatement = function( genericQueryStatementsEnum, tableName, sequelizePropertiesArray ){

    let selectedStatement = '';
    switch(genericQueryStatementsEnum){

        case genericQueryStatement.selectWherePropertyEqualsAnd:
            selectedStatement = selectWherePropertyEqualsAnd(tableName, sequelizePropertiesArray);
            break;

        case genericQueryStatement.selectAllFromTable:
            selectedStatement = selectAllFromTable(tableName);
            break;

        case genericQueryStatement.insertIntoTableValues:
            selectedStatement = insertIntoTableValues(tableName, sequelizePropertiesArray);
            break;

        case genericQueryStatement.deleteFromTableWhere:
            selectedStatement = deleteFromTableWhere(tableName, sequelizePropertiesArray);
            break;

    }

    return selectedStatement;
}

let service = {

    createSimpleQueryStatement : createSimpleQueryStatement,
    selectWherePropertyEqualsAnd : selectWherePropertyEqualsAnd,
    selectAllFromTable : selectAllFromTable,
    insertIntoTableValues : insertIntoTableValues,
    deleteFromTableWhere : deleteFromTableWhere,
    updateTableSetColumnValuesWhere : updateTableSetColumnValuesWhere,
    selectWherePropertyEqualsAndIsNull : selectWherePropertyEqualsAndIsNull
}

module.exports = service;
